using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class ArticlePutModel {
        [Required]
        public string Title { get; set; }
        public string Abstract { get; set; }
        public ICollection<Section> Sections { get; set; }

        public Article CreateArticle() {
            Article article = new Article();
            UpdateArticle(article);
            return article;
        }

        public void UpdateArticle(Article article) {
            article.Title = Title;
            article.Abstract = Abstract;
            article.Sections = Sections;
        }
    }
}
