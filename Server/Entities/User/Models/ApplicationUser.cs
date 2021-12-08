using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {
    public class ApplicationUser : IdentityUser<long> {
    }
}
