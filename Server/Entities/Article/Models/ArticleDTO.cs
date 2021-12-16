using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities
{
    public class ArticleDTO
    {
        public long ID { get; set; }
        public string Title { get; set; }
        public string Abstract { get; set; }
        public WikiDTO Wiki { get; set; }
        public ICollection<Section> Sections { get; set; }
        public ApplicationUserDTO Creator { get; set; }
        public ApplicationUserDTO Modifier { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }

        public ArticleDTO(Article article)
        {
            ID = article.ID;
            Title = article.Title;
            Abstract = article.Abstract;
            Wiki = new WikiDTO(article.Wiki);
            Wiki.Owner = null;
            Wiki.Maintainers = null;
            Sections = article.Sections;
            Creator = article.Creator == null ? null : new ApplicationUserDTO(article.Creator);
            Modifier = article.Modifier == null ? null : new ApplicationUserDTO(article.Modifier);
            CreationDate = article.CreationDate;
            ModificationDate = article.ModificationDate;
        }
    }
}
