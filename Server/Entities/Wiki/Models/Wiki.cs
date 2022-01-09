using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class Wiki {
        [Key]
        public long ID { get; set; }
        public string URL { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser Owner { get; set; }
        public ICollection<ApplicationUser> Maintainers { get; set; }

        public bool CanBeModifiedBy(ApplicationUser user) {
            if(Owner == user) {
                return true;
            }
            foreach(ApplicationUser maintainer in Maintainers) {
                if(maintainer == user) {
                    return true;
                }
            }
            return false;
        }
    }
}
