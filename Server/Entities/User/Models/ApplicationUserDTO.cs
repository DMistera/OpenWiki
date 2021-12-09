using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class ApplicationUserDTO {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public IEnumerable<WikiDTO> OwnedWikis { get; set; }
        public IEnumerable<WikiDTO> MaintainedWikis { get; set; }

        public ApplicationUserDTO(ApplicationUser applicationUser) {
            Id = applicationUser.Id;
            UserName = applicationUser.UserName;
            Email = applicationUser.Email;
            EmailConfirmed = applicationUser.EmailConfirmed;
            // Break object cycle
            OwnedWikis = applicationUser.OwnedWikis?.Select(wiki => {
                return new WikiDTO(wiki) {
                    Owner = null,
                    Maintainers = null
                };
            });
            MaintainedWikis = applicationUser.MaintainedWikis?.Select(wiki => {
                return new WikiDTO(wiki) {
                    Owner = null,
                    Maintainers = null
                };
            });
        }
    }
}
