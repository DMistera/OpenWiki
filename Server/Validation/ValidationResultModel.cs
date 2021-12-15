using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenWiki.Server
{

    public class ValidationResultModel
    {
        public int Status { get; }

        public List<ValidationError> Error { get; }

        public ValidationResultModel(ModelStateDictionary modelState, int Status)
        {
            this.Status = Status;
            Error = modelState.Keys
                    .SelectMany(key => modelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage)))
                    .ToList();
        }
    }
}
