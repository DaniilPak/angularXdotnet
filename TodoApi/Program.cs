using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApiDb>(opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("WebApiDatabase")));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                      });
});

var app = builder.Build();

app.MapGet("/contacts", async (ApiDb db) =>
    await db.Contacts.ToListAsync());

app.MapGet("/contacts/{id}", async (int id, ApiDb db) =>
    await db.Contacts.FindAsync(id)
        is Contact contact
            ? Results.Ok(contact)
            : Results.NotFound());

app.MapPost("/contacts", async (Contact contact, ApiDb db) =>
{
    db.Contacts.Add(contact);
    await db.SaveChangesAsync();

    return Results.Created($"/contacts/{contact.Id}", contact);
});

app.MapPut("/contacts/{id}", async (int id, Contact inputcontact, ApiDb db) =>
{
    var contact = await db.Contacts.FindAsync(id);

    if (contact is null) return Results.NotFound();

    contact.Name = inputcontact.Name;
    contact.LastName = inputcontact.LastName;
    contact.Phone = inputcontact.Phone;
    contact.Description = inputcontact.Description;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/contacts/{id}", async (int id, ApiDb db) =>
{
    if (await db.Contacts.FindAsync(id) is Contact contact)
    {
        db.Contacts.Remove(contact);
        await db.SaveChangesAsync();
        return Results.Ok(contact);
    }

    return Results.NotFound();
});

app.UseCors(MyAllowSpecificOrigins);
app.Run();