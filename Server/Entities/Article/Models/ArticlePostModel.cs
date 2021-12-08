using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class ArticlePostModel : ArticlePutModel {
        [Required]
        public long WikiID { get; set; }
    }
}
