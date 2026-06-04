// the cat "module" — a dedicated namespace as the bounded context.
namespace FrameworksDemo.Cat;

// record Cat: System.Text.Json camelCases -> {"id":..,"name":..}.
public record Cat(int Id, string Name);

// CatService is created + managed by the ASP.NET IoC container.
public class CatService
{
    private readonly List<Cat> _cats = new() { new(1, "Milo"), new(2, "Luna") };

    // All -> GET /cats.
    public IReadOnlyList<Cat> All() => _cats;

    // SpyHint -> the piece the dog module consumes via DI.
    public string SpyHint() => "cat-network-ready";
}
