using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenWiki.Server;

namespace OpenWiki.Server.Entities
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SectionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Section
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Section>>> GetSection()
        {
            return await _context.Sections.ToListAsync();
        }

        // GET: api/Section/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Section>> GetSection(long id)
        {
            var section = await _context.Sections.FindAsync(id);

            if (section == null)
            {
                return NotFound();
            }

            return section;
        }

        // PUT: api/Section/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSection(long id, Section section)
        {
            if (id != section.ID)
            {
                return BadRequest();
            }

            _context.Entry(section).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SectionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Section
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Section>> PostSection(Section section)
        {
            _context.Sections.Add(section);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSection", new { id = section.ID }, section);
        }

        // DELETE: api/Section/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Section>> DeleteSection(long id)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                return NotFound();
            }

            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();

            return section;
        }

        private bool SectionExists(long id)
        {
            return _context.Sections.Any(e => e.ID == id);
        }
    }
}
