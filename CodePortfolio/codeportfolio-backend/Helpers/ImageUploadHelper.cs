namespace CodePortfolio.Helpers
{
    public static class ImageUploadHelper
    {
        public const long MaxBytes = 5 * 1024 * 1024;

        public static async Task<string?> GetSafeExtensionAsync(IFormFile file)
        {
            if (file.Length <= 0 || file.Length > MaxBytes) return null;

            var header = new byte[12];
            await using var stream = file.OpenReadStream();
            var read = await stream.ReadAsync(header.AsMemory(0, header.Length));

            if (read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF) return ".jpg";
            if (read >= 8 && header.AsSpan(0, 8).SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A })) return ".png";
            if (read >= 6 && (System.Text.Encoding.ASCII.GetString(header, 0, 6) is "GIF87a" or "GIF89a")) return ".gif";
            if (read >= 12 && System.Text.Encoding.ASCII.GetString(header, 0, 4) == "RIFF" &&
                System.Text.Encoding.ASCII.GetString(header, 8, 4) == "WEBP") return ".webp";

            return null;
        }
    }
}
