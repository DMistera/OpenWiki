using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenWiki.Server.Entities {
    public class Category {
        [Key]
        public long ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        [ForeignKey("CreatorId")]
        public ApplicationUser Creator { get; set; }
        [ForeignKey("ModifierId")]
        public ApplicationUser Modifier { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public ICollection<Article> Articles { get; set; }
    }
}
