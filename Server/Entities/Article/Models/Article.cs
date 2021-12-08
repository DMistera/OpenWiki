using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class Article {
        [Key]
        public long ID { get; set; }
        public string Title { get; set; }
        public string Abstract { get; set; }
        public Wiki Wiki { get; set; }
        public ICollection<Section> Sections { get; set; }
        [ForeignKey("CreatorId")]
        public ApplicationUser Creator { get; set; }
        [ForeignKey("ModifierId")]
        public ApplicationUser Modifier { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
    }
}
