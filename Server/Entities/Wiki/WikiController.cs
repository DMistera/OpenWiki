using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenWiki.Server;

namespace OpenWiki.Server.Entities
{
    [Route("api/[controller]")]
    [ApiController]
    public class WikiController : ControllerBase
    {

        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> userManager;

        public WikiController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
        }

        // GET: api/Wiki
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WikiDTO>>> GetWikis(long ownerID, string search) {
            IQueryable<Wiki> query = dbContext.Wikis
                .Include(o => o.Owner)
                .Include(o => o.Maintainers);
            if (ownerID > 0) {
                query = query.Where(o => o.Owner.Id == ownerID);
            }
            if (search != null && search.Length > 0) {
                query = query.Where(o =>
                    o.Name.ToLower().Contains(search.ToLower()) ||
                    o.URL.ToLower().Contains(search.ToLower()) ||
                    o.Description.ToLower().Contains(search.ToLower())
                );
            }
            var queryResult = await query.ToListAsync();
            return Ok(queryResult.Select(wiki => new WikiDTO(wiki)));
        }

        // GET: api/Wiki/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WikiDTO>> GetWiki(long id)
        {
            var wiki = await dbContext.Wikis.Include(o => o.Owner).Include(o => o.Maintainers).FirstOrDefaultAsync(i => i.ID == id);

            if (wiki == null)
            {
                return NotFound();
            }

            return new WikiDTO(wiki);
        }

        // GET: api/Wiki/5
        [HttpGet("url/{url}")]
        public async Task<ActionResult<WikiDTO>> GetWikiByURL(string url) {
            var wiki = await dbContext.Wikis.Include(o => o.Owner).Include(o => o.Maintainers).FirstOrDefaultAsync(i => i.URL == url);

            if (wiki == null) {
                return NotFound();
            }

            return new WikiDTO(wiki);
        }

        // PUT: api/Wiki/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWiki(long id, WikiPostPutModel wikiPostPutModel)
        {
            Wiki wiki = await dbContext.Wikis.Include(o => o.Owner).Include(o => o.Maintainers).FirstOrDefaultAsync(i => i.ID == id);
            if (wiki == null) {
                return NotFound();
            }
            ApplicationUser user = await userManager.GetUserAsync(User);
            if (!wiki.CanBeModifiedBy(user)) {
                ModelState.AddModelError("NotPermitted", "User does not have necessary role");
                return ValidationProblem(ModelState);
            }
            if (wiki.URL != wikiPostPutModel.URL && await IsUrlTaken(wikiPostPutModel.URL)) {
                ModelState.AddModelError("UrlDuplicate", "This URL is already taken.");
                return ValidationProblem(ModelState);
            }
            wikiPostPutModel.UpdateWiki(wiki);
            dbContext.Entry(wiki).State = EntityState.Modified;

            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("maintainer")]
        public async Task<IActionResult> AddMaintainer(WikiMaintainerModel model) {
            Wiki wiki = await dbContext.Wikis.Include(o => o.Owner).Include(o => o.Maintainers).FirstOrDefaultAsync(i => i.ID == model.WikiId);
            if (wiki == null) {
                return NotFound();
            }
            ApplicationUser user = await userManager.GetUserAsync(User);
            if (!wiki.CanBeModifiedBy(user)) {
                ModelState.AddModelError("NotPermitted", "User does not have necessary role");
                return ValidationProblem(ModelState);
            }
            ApplicationUser maintainer = await userManager.FindByIdAsync(model.MaintainerId.ToString()); // why is it correct in asp.net?
            if(maintainer == null) {
                return NotFound("Maintainer not found");
            }
            wiki.Maintainers.Add(maintainer);
            dbContext.Entry(wiki).State = EntityState.Modified;

            await dbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpDelete("maintainer")]
        public async Task<IActionResult> RemoveMaintainer(WikiMaintainerModel model) {
            Wiki wiki = await dbContext.Wikis.Include(o => o.Owner).Include(o => o.Maintainers).FirstOrDefaultAsync(i => i.ID == model.WikiId);
            if (wiki == null) {
                return NotFound();
            }
            ApplicationUser user = await userManager.GetUserAsync(User);
            if (!wiki.CanBeModifiedBy(user)) {
                ModelState.AddModelError("NotPermitted", "User does not have necessary role");
                return ValidationProblem(ModelState);
            }
            ApplicationUser maintainer = await userManager.FindByIdAsync(model.MaintainerId.ToString()); // why is it correct in asp.net?
            if (maintainer == null) {
                return NotFound("Maintainer not found");
            }
            if(!wiki.Maintainers.Remove(maintainer)) {
                return NotFound("Wiki does not have this maintainer");
            }
            dbContext.Entry(wiki).State = EntityState.Modified;

            await dbContext.SaveChangesAsync();

            return Ok();
        }

        // POST: api/Wiki
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<WikiDTO>> PostWiki(WikiPostPutModel wikiPostPutModel)
        {
            Wiki wiki = wikiPostPutModel.CreateWiki();
            if(await IsUrlTaken(wiki.URL)) {
                ModelState.AddModelError("UrlDuplicate", "This URL is already taken.");
                return ValidationProblem(ModelState);
            }
            ApplicationUser user = await userManager.GetUserAsync(User);
            wiki.Owner = user;
            wiki.CreationDate = DateTime.Now;
            dbContext.Wikis.Add(wiki);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetWiki", new { id = wiki.ID }, new WikiDTO(wiki));
        }

        // DELETE: api/Wiki/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWiki(long id)
        {
            var wiki = await dbContext.Wikis.FindAsync(id);
            if (wiki == null)
            {
                return NotFound();
            }

            dbContext.Wikis.Remove(wiki);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        private async Task<bool> IsUrlTaken(string url) {
            return await dbContext.Wikis.AnyAsync(i => i.URL == url);
        }
    }
}
