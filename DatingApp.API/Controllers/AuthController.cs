using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository authRepository, IConfiguration config)
        {
            _config = config;
            _repo = authRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDTO userForRegisterDTO)
        {
            userForRegisterDTO.UserName = userForRegisterDTO.UserName.ToLower();

            if (await _repo.UserExists(userForRegisterDTO.UserName))
                return BadRequest("The user already exists");

            var userToCreate = new User
            {
                UserName = userForRegisterDTO.UserName
            };

            var createdUser = await _repo.Register(userToCreate, userForRegisterDTO.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDTO userForLoginDTO)
        {
            // No hago validaciones dentro del DTO ([Required], etc), esa validacion ya la hace el metodo _repo.Login()
            var userFromRepo = await _repo.Login(userForLoginDTO.UserName.ToLower(), userForLoginDTO.Password);

            if (userFromRepo == null)
                return Unauthorized();


            // CREACION DE TOKEN
            // 1- Creo esto en el payload para que cuando el usuario mande el token de nuevo yo pueda tener esta info y no ir a la DB
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.UserName)
            };

            // 2- Esta es la generacion de la key que voy a usar para desencriptar cada vez que envio o recibo el token 
            // y poder asi leer el payload
            // En otras palabras el server necesita firmar el token con la Key que le damos.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            // 3- Se crea la firma digital con la Key a usar y el algoritmo.
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // 4- Contiene la informacion y data para crear el token de seguridad
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            // Con esto puedo crar un token y pasarle el TokenDescriptor
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}