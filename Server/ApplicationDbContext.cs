using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using OpenWiki.Server.Entities;

namespace OpenWiki.Server {
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, long> {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration) : base(options) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseSqlServer(Configuration.GetConnectionString("DbContext"));
        }

        protected override void OnModelCreating(ModelBuilder builder) {
            base.OnModelCreating(builder);

            builder.Entity<Wiki>()
                .HasIndex(u => u.URL)
                .IsUnique();
        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Wiki> Wikis { get; set; }
    }
}
