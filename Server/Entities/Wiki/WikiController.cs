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
        public async Task<ActionResult<IEnumerable<Wiki>>> GetWikis(long userID)
        {
            IQueryable<Wiki> query = dbContext.Wikis.Include(o => o.Owner);
            if(userID > 0) {
                query = query.Where(o => o.Owner.Id == userID);
            }
            return await query.ToListAsync();
        }

        // GET: api/Wiki/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Wiki>> GetWiki(long id)
        {
            var wiki = await dbContext.Wikis.Include(o => o.Owner).FirstOrDefaultAsync(i => i.ID == id);

            if (wiki == null)
            {
                return NotFound();
            }

            return wiki;
        }

        // GET: api/Wiki/5
        [HttpGet("url/{url}")]
        public async Task<ActionResult<Wiki>> GetWikiByURL(string url) {
            var wiki = await dbContext.Wikis.Include(o => o.Owner).FirstOrDefaultAsync(i => i.URL == url);

            if (wiki == null) {
                return NotFound();
            }

            return wiki;
        }

        // PUT: api/Wiki/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWiki(long id, WikiPostPutModel wikiPostPutModel)
        {
            Wiki wiki = dbContext.Wikis.Find(id);
            wikiPostPutModel.UpdateWiki(wiki);
            dbContext.Entry(wiki).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WikiExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // POST: api/Wiki
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Wiki>> PostWiki(WikiPostPutModel wikiPostPutModel)
        {
            Wiki wiki = wikiPostPutModel.CreateWiki();
            ApplicationUser user = await userManager.GetUserAsync(User);
            wiki.Owner = user;
            dbContext.Wikis.Add(wiki);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetWiki", new { id = wiki.ID }, wiki);
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

        private bool WikiExists(long id)
        {
            return dbContext.Wikis.Any(e => e.ID == id);
        }
    }
}
