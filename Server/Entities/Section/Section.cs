using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class Section {
        [Key]
        public long ID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}
