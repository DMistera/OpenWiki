using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server.Exceptions {
    public class ValidationException : Exception {
        public ValidationException(string key, string message) : base(message) {
            Key = key;
        }

        public string Key { get; set; }

        public void AddToModelState(ModelStateDictionary modelState) {
            modelState.AddModelError(Key, Message);
        }
    }
}
