using CodePortfolio.Helpers;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace CodePortfolio.Tests;

public class ImageUploadHelperTests
{
    [Fact]
    public async Task DetectsPngByContentInsteadOfFilename()
    {
        var bytes = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0 };
        await using var stream = new MemoryStream(bytes);
        var file = new FormFile(stream, 0, bytes.Length, "file", "malicious.exe");

        Assert.Equal(".png", await ImageUploadHelper.GetSafeExtensionAsync(file));
    }

    [Fact]
    public async Task RejectsUnknownContent()
    {
        await using var stream = new MemoryStream("not an image"u8.ToArray());
        var file = new FormFile(stream, 0, stream.Length, "file", "fake.png");

        Assert.Null(await ImageUploadHelper.GetSafeExtensionAsync(file));
    }
}
