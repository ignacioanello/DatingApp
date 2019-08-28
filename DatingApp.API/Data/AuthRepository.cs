using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            this._context = context;
        }
        public async Task<User> Login(string userName, string password)
        {
            //Chequeo que el usuario exista, si existe, tengo el user y el hash para validar
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);

            if (user == null)
                return null;

            if(!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] DBpasswordHash, byte[] DBpasswordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(DBpasswordSalt))
            {
                //Aca genero el hash, de nuevo, con el salt que tenia el usuario (passwordSalt) en la DB, a ver si da lo mismo
                var actualComputedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < actualComputedHash.Length; i++)
                {
                    if(actualComputedHash[i] != DBpasswordHash[i])
                        return false;
                }
                return true;
            }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            //Le paso los 'out', como referencia, asi puedo obtener ambos valores
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            //Guardo el hash generado con su salt
            user.PasswordSalt = passwordSalt;
            user.PasswordHash = passwordHash;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            //Genera la Key de manera random
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                //Con esa key genera el hash (pasandole el password a hashear).
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string userName)
        {
            if(await _context.Users.AnyAsync(u => u.UserName == userName))
                return true;

            return false;
        }
    }
}