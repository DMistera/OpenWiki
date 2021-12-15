using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace OpenWiki.Server
{
    public class ValidationFailedResult : ObjectResult
    {
        public ValidationFailedResult(ModelStateDictionary modelState) : base(new ValidationResultModel(modelState, StatusCodes.Status400BadRequest))
        {
            StatusCode = StatusCodes.Status400BadRequest;
        }
    }
}
