using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> userManager;

        public CategoryController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager) {
            this.dbContext = dbContext;
            this.userManager = userManager;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories(long userID, string search, int lastModified) {
            var query = PrepareQuery();
            if (userID > 0) {
                query = query.Where(o => o.Creator.Id == userID);
            }
            if (search != null && search.Length > 0) {
                query = query.Where(o =>
                    o.Name.ToLower().Contains(search.ToLower()) ||
                    o.Description.ToLower().Contains(search.ToLower())
                );
            }
            if (lastModified > 0) {
                query = query.OrderByDescending(o => o.ModificationDate).Take(lastModified);
            }
            var queryResult = await query.ToListAsync();
            return Ok(queryResult.Select(category => new CategoryDTO(category)));
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(long id) {
            var category = await PrepareQuery().FirstOrDefaultAsync(i => i.ID == id);

            if (category == null) {
                return NotFound();
            }

            return new CategoryDTO(category);
        }

        // PUT: api/Category/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(long id, CategoryPostPutModel categoryPutModel) {
            Category category = await PrepareQuery().FirstOrDefaultAsync(i => i.ID == id);
            if (category == null) {
                return NotFound();
            }

            categoryPutModel.UpdateCategory(category);

            ApplicationUser user = await userManager.GetUserAsync(User);
            category.Modifier = user;
            category.ModificationDate = DateTime.Now;

            dbContext.Entry(category).State = EntityState.Modified;

            try {
                await dbContext.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!CategoryExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return Ok();
        }

        // POST: api/Category
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> PostCategory(CategoryPostPutModel categoryPostModel) {
            Category category = categoryPostModel.CreateCategory();
            ApplicationUser user = await userManager.GetUserAsync(User);
            category.Creator = user;
            category.CreationDate = DateTime.Now;
            dbContext.Categories.Add(category);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.ID }, new CategoryDTO(category));
        }

        // DELETE: api/Category/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<CategoryDTO>> DeleteCategory(long id) {
            var category = await PrepareQuery().FirstOrDefaultAsync(i => i.ID == id);
            if (category == null) {
                return NotFound();
            }

            dbContext.Categories.Remove(category);
            await dbContext.SaveChangesAsync();

            return new CategoryDTO(category);
        }

        [HttpPut("affiliation")]
        public async Task<IActionResult> AddMaintainer(CategoryAffiliation model) {
            Category category = await PrepareQuery().FirstOrDefaultAsync(i => i.ID == model.CategoryId);
            if (category == null) {
                return NotFound();
            }
            Article article = await dbContext.Articles.Include(o => o.Categories).Include(o => o.Wiki).FirstOrDefaultAsync(i => i.ID == model.ArticleId);
            if (article == null) {
                return NotFound("Maintainer not found");
            }
            ApplicationUser user = await userManager.GetUserAsync(User);
            if (!article.Wiki.CanBeModifiedBy(user)) {
                ModelState.AddModelError("NotPermitted", "User does not have necessary role");
                return ValidationProblem(ModelState);
            }
            category.Articles.Add(article);
            dbContext.Entry(category).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
            return Ok();
        }


        [HttpDelete("affiliation")]
        public async Task<IActionResult> RemoveMaintainer(CategoryAffiliation model) {
            Category category = await PrepareQuery().FirstOrDefaultAsync(i => i.ID == model.CategoryId);
            if (category == null) {
                return NotFound();
            }
            Article article = await dbContext.Articles.Include(o => o.Categories).Include(o => o.Wiki).FirstOrDefaultAsync(i => i.ID == model.ArticleId);
            if (article == null) {
                return NotFound("Maintainer not found");
            }
            ApplicationUser user = await userManager.GetUserAsync(User);
            if (!article.Wiki.CanBeModifiedBy(user)) {
                ModelState.AddModelError("NotPermitted", "User does not have necessary role");
                return ValidationProblem(ModelState);
            }
            category.Articles.Remove(article);
            dbContext.Entry(category).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
            return Ok();
        }

        private bool CategoryExists(long id) {
            return dbContext.Categories.Any(e => e.ID == id);
        }

        private IQueryable<Category> PrepareQuery() {
            return dbContext.Categories
                .Include(o => o.Articles)
                .Include(o => o.Creator)
                .Include(o => o.Modifier);
        }
    }
}
