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
        public async Task<ActionResult<IEnumerable<Article>>> GetArticles(long wikiID, long userID)
        {
            var query = PrepareArticlesQuery();
            if(wikiID > 0) {
                query = query.Where(o => o.Wiki.ID == wikiID);
            }
            if (userID > 0) {
                query = query.Where(o => o.Creator.Id == userID);
            }
            return await query.ToListAsync();
        }

        // GET: api/Article/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticle(long id)
        {
            var article = await PrepareArticlesQuery().FirstOrDefaultAsync(i => i.ID == id);

            if (article == null)
            {
                return NotFound();
            }

            return article;
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

        // POST: api/Article
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Article>> PostArticle(ArticlePostModel articlePostModel)
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
            dbContext.Articles.Add(article);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetArticle", new { id = article.ID }, article);
        }

        // DELETE: api/Article/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Article>> DeleteArticle(long id)
        {
            var article = await dbContext.Articles.Include(o => o.Sections).FirstOrDefaultAsync(i => i.ID == id);
            if (article == null)
            {
                return NotFound();
            }

            dbContext.Sections.RemoveRange(article.Sections);
            dbContext.Articles.Remove(article);
            await dbContext.SaveChangesAsync();

            return article;
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
