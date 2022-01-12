namespace OpenWiki.Server.Entities {
    public class CategoryPostPutModel {
        public string Name { get; set; }
        public string Description { get; set; }

        public Category CreateCategory() {
            Category category = new Category();
            UpdateCategory(category);
            return category;
        }

        public void UpdateCategory(Category category) {
            category.Name = Name;
            category.Description = Description;
        }
    }
}
