using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class RegisterModel {

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public ApplicationUser CreateUser() {
            return new ApplicationUser {
                UserName = UserName,
                Email = Email,
                EmailConfirmed = false
            };
        }
    }
}
