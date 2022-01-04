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
using OpenWiki.Server.Exceptions;

namespace OpenWiki.Server.Entities
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> userManager;

        public ArticleController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
        }

        // GET: api/Article
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleDTO>>> GetArticles(long wikiID, long userID, bool active)
        {
            var query = PrepareArticlesQuery();
            if(wikiID > 0) {
                query = query.Where(o => o.Wiki.ID == wikiID);
            }
            if (userID > 0) {
                query = query.Where(o => o.Creator.Id == userID);
            }
            if (active) {
                query = query.Where(o => o.Active);
            }
            var queryResult = await query.ToListAsync();
            return Ok(queryResult.Select(article => new ArticleDTO(article)));
        }

        // GET: api/Article/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDTO>> GetArticle(long id)
        {
            var article = await PrepareArticlesQuery().FirstOrDefaultAsync(i => i.ID == id);

            if (article == null)
            {
                return NotFound();
            }

            return new ArticleDTO(article);
        }

        // PUT: api/Article/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticle(long id, ArticlePutModel articlePutModel)
        {
            Article article = await PrepareArticlesQuery().FirstOrDefaultAsync(i => i.ID == id);
            if (article == null) {
                return NotFound();
            }

            dbContext.Sections.RemoveRange(article.Sections);

            articlePutModel.UpdateArticle(article);

            ApplicationUser user = await userManager.GetUserAsync(User);
            article.Modifier = user;
            article.ModificationDate = DateTime.Now;

            dbContext.Entry(article).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticleExists(id))
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

        [Authorize]
        [HttpPut("activate/{id}")]
        public async Task<IActionResult> ActivateArticle(long id) {
            Article article = await PrepareArticlesQuery().FirstOrDefaultAsync(i => i.ID == id);
            if (article == null) {
                return NotFound();
            }
            if (article.Active) {
                ModelState.AddModelError("ArticleActive", "This article is already active");
                return ValidationProblem(ModelState);
            }
            article.Active = true;
            dbContext.Entry(article).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
            return Ok(new ArticleDTO(article));
        }

        [Authorize]
        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> ActivateArticle(long id) {
            Article article = await PrepareArticlesQuery().FirstOrDefaultAsync(i => i.ID == id);
            if (article == null) {
                return NotFound();
            }
            if (article.Active) {
                ModelState.AddModelError("ArticleActive", "This article is already active");
                return ValidationProblem(ModelState);
            }
            article.Active = false;
            dbContext.Entry(article).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
            return Ok(new ArticleDTO(article));
        }


        // POST: api/Article
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ArticleDTO>> PostArticle(ArticlePostModel articlePostModel)
        {
            Article article = articlePostModel.CreateArticle();
            Wiki wiki = dbContext.Wikis.Find(articlePostModel.WikiID);
            if(wiki != null) {
                article.Wiki = wiki;
            }
            else {
                ModelState.AddModelError("WikiDoesNotExist", "Wiki with given id does not exist");
                return ValidationProblem(ModelState);
            }

            ApplicationUser user = await userManager.GetUserAsync(User);
            article.Creator = user;
            article.CreationDate = DateTime.Now;
            article.Active = false;
            dbContext.Articles.Add(article);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetArticle", new { id = article.ID }, new ArticleDTO(article));
        }

        // DELETE: api/Article/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ArticleDTO>> DeleteArticle(long id)
        {
            var article = await dbContext.Articles.Include(o => o.Sections).FirstOrDefaultAsync(i => i.ID == id);
            if (article == null)
            {
                return NotFound();
            }

            dbContext.Sections.RemoveRange(article.Sections);
            dbContext.Articles.Remove(article);
            await dbContext.SaveChangesAsync();

            return new ArticleDTO(article);
        }

        private bool ArticleExists(long id)
        {
            return dbContext.Articles.Any(e => e.ID == id);
        }

        private IQueryable<Article> PrepareArticlesQuery() {
            return dbContext.Articles
                .Include(o => o.Wiki)
                .Include(o => o.Sections)
                .Include(o => o.Creator)
                .Include(o => o.Modifier);
        }
    }
}
