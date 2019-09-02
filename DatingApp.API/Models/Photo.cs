using System;

namespace DatingApp.API.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }

        // Usado para la relacion y la eliminacion en cascada (cuando se elimina un user tambien las fotos)
        // ver: 20190830173341_ExtendedUserClass.cs (onDelete: ReferentialAction.Cascade) y 
        // userId != null - (UserId = table.Column<int>(nullable: false))
        public User User { get; set; }
        public int UserId { get; set; }
    }
}