namespace OpenWiki.Server
{
    public class ValidationError
    {
        public string Key { get; }

        public string Message { get; }

        public ValidationError(string key, string message)
        {
            Key = key != string.Empty ? key : null;
            Message = message;
        }
    }
}
