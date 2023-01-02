using Microsoft.EntityFrameworkCore;

class ApiDb : DbContext
{
    public ApiDb(DbContextOptions<ApiDb> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
    }

    public DbSet<Contact> Contacts { get; set; }
}