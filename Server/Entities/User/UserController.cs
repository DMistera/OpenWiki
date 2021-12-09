using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenWiki.Server.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Entities {

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase {

        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly EmailSender emailSender;

        public UserController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, EmailSender emailSender) {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.emailSender = emailSender;
        }

        [HttpGet]
        public async Task<ActionResult<ApplicationUserDTO>> GetUser() {
            var user = await userManager.GetUserAsync(User);
            if (user == null) {
                return NoContent();
            } 
            else {
                return Ok( new ApplicationUserDTO(user) );
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginModel model) {
            Microsoft.AspNetCore.Identity.SignInResult result = await signInManager.PasswordSignInAsync(model.UserName, model.Password, true, false);
            if (result.Succeeded) {
                return Ok();
            }
            else if (result.IsLockedOut) {
                ModelState.AddModelError("LockedOut", "Account is locked out");
            } else if (result.IsNotAllowed) {
                ModelState.AddModelError("IsNotAllowed", "Email confirmation required");
            } else {
                ModelState.AddModelError("InvalidLogin", "Login or Password is incorrect");
            }
            return ValidationProblem(ModelState);
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout() {
            await signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterModel register) {
            ApplicationUser user = register.CreateUser();
            IdentityResult result = await userManager.CreateAsync(
                user,
                register.Password
            );
            if (!result.Succeeded) {
                foreach (IdentityError error in result.Errors) {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem(ModelState);
            }

            string confirmationToken = userManager.GenerateEmailConfirmationTokenAsync(user).Result;
            string confirmationLink = Url.Action("ConfirmEmail","User", new {
                  userid = user.Id,
                  token = confirmationToken
              }, protocol: HttpContext.Request.Scheme);
            emailSender.Send(user, "Confirm your email", confirmationLink);
            return Ok();
        }

        [HttpGet("ConfirmEmail")]
        public IActionResult ConfirmEmail(string userid, string token) {
            ApplicationUser user = userManager.FindByIdAsync(userid).Result;
            IdentityResult result = userManager.
                        ConfirmEmailAsync(user, token).Result;
            if (result.Succeeded) {
                return Redirect("https://localhost:4200/auth/confirm-email/success/");
            } else {
                string errorCode = result.Errors.First().Code;
                return Redirect($"https://localhost:4200/auth/confirm-email/failure/?error={errorCode}");
            }
        }
    }
}
