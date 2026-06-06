// The cat "module" — a dedicated namespace as the bounded context.
namespace FrameworksDemo.Cat;

/// <summary>
/// Immutable data record representing a single cat.
/// <para>
/// <c>System.Text.Json</c> serializes properties in camelCase by default:
/// <c>{"id": .., "name": ..}</c>, matching the API contract.
/// </para>
/// </summary>
/// <param name="Id">Unique identifier of the cat.</param>
/// <param name="Name">Display name of the cat.</param>
public record Cat(int Id, string Name);

/// <summary>
/// Business-logic service for cat data.
/// <para>
/// Registered as a singleton via <c>AddSingleton&lt;CatService&gt;()</c> in Program.cs.
/// The ASP.NET IoC container creates one instance and injects it wherever required
/// (Minimal API handlers and <c>DogService</c> constructor).
/// </para>
/// </summary>
public class CatService
{
    /// <summary>Shared, immutable cat dataset used by all public methods.</summary>
    private readonly List<Cat> _cats = new() { new(1, "Milo"), new(2, "Luna") };

    /// <summary>
    /// Return the full cat list — consumed by <c>GET /cats</c>.
    /// </summary>
    /// <returns>Read-only list of <see cref="Cat"/> records.</returns>
    public IReadOnlyList<Cat> All() => _cats;

    /// <summary>
    /// Provide a status hint consumed by <see cref="FrameworksDemo.Dog.DogService"/> via DI.
    /// <para>
    /// Exists solely to prove that <c>DogService</c> can call methods on the injected
    /// <c>CatService</c> without creating a new instance.
    /// </para>
    /// </summary>
    /// <returns>Fixed status string <c>"cat-network-ready"</c>.</returns>
    public string SpyHint() => "cat-network-ready";
}
