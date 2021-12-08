using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class WikiPostPutModel {
        [Required]
        public string URL { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        public Wiki CreateWiki() {
            Wiki wiki = new Wiki();
            UpdateWiki(wiki);
            return wiki;
        }

        public void UpdateWiki(Wiki wiki) {
            wiki.URL = URL;
            wiki.Name = Name;
            wiki.Description = Description;
        }
    }
}
