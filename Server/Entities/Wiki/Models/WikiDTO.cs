using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class WikiDTO {
        public long ID { get; set; }
        public string URL { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ApplicationUserDTO Owner { get; set; }
        public IEnumerable<ApplicationUserDTO> Maintainers { get; set; }

        public WikiDTO(Wiki wiki) {
            ID = wiki.ID;
            URL = wiki.URL;
            Name = wiki.Name;
            Description = wiki.Description;
            Owner = wiki.Owner != null ? new ApplicationUserDTO(wiki.Owner) : null;
            Maintainers = wiki.Maintainers?.Select(maintainer => new ApplicationUserDTO(maintainer));
        }
    }
}
