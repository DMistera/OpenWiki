using System;
using System.Collections.Generic;
using System.Linq;

namespace OpenWiki.Server.Entities {
    public class CategoryDTO {
        public long ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ApplicationUserDTO Creator { get; set; }
        public ApplicationUserDTO Modifier { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public IEnumerable<ArticleDTO> Articles { get; set; }

        public CategoryDTO(Category category) {
            ID = category.ID;
            Name = category.Name;
            Description = category.Description;
            Creator = new ApplicationUserDTO(category.Creator);
            Modifier = category.Modifier  == null ? null : new ApplicationUserDTO(category.Modifier);
            CreationDate = category.CreationDate;
            ModificationDate = category.ModificationDate;
            Articles = category.Articles?.Select(article => new ArticleDTO(article) { Categories = null });
        }
    }
}
