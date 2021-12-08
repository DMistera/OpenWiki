using OpenWiki.Server.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace OpenWiki.Server.Utils {
    public class EmailSender {

        private SmtpClient smtpClient;

        public EmailSender() {
            Initialize();
        }

        public void Initialize() {
            string email = Environment.GetEnvironmentVariable("email");
            string password = Environment.GetEnvironmentVariable("email_password");
            smtpClient = new SmtpClient("smtp.gmail.com", 587) {
                EnableSsl = true,
                Credentials = new NetworkCredential(email, password)
            };
        }

        public void Send(ApplicationUser receiver, string subject, string message) {
            // add from,to mailaddresses
            MailAddress from = new MailAddress(Environment.GetEnvironmentVariable("email"), "OpenWiki");
            MailAddress to = new MailAddress(receiver.Email, receiver.UserName);
            MailMessage myMail = new MailMessage(from, to);

            // add ReplyTo
            MailAddress replyTo = new MailAddress("reply@example.com");
            myMail.ReplyToList.Add(replyTo);

            // set subject and encoding
            myMail.Subject = subject;
            myMail.SubjectEncoding = System.Text.Encoding.UTF8;

            // set body-message and encoding
            myMail.Body = message;
            myMail.BodyEncoding = System.Text.Encoding.UTF8;
            // text or html
            myMail.IsBodyHtml = false;

            smtpClient.Send(myMail);
        }
    }
}
