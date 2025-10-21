"""
CLI de gestión de la aplicación (comandos administrativos)
Usa Click para crear comandos: create_db, drop_db, create_admin
Ejecutar: python manage.py <comando> [opciones]
"""
import click
from app import create_app
from extensions import db
from models.user import User
from werkzeug.security import generate_password_hash


# Crear instancia de la app para usar en comandos
app = create_app()


@click.group()
def cli():
    """Grupo de comandos CLI"""
    pass


@cli.command("create_db")
def create_db():
    """
    Crea todas las tablas definidas en los modelos (db.create_all())
    Uso: python manage.py create_db
    """
    with app.app_context():
        db.create_all()
        print("Tablas creadas.")


@cli.command("drop_db")
def drop_db():
    """
    Elimina todas las tablas de la BD (db.drop_all())
    ⚠️ CUIDADO: Borra todos los datos
    Uso: python manage.py drop_db
    """
    with app.app_context():
        db.drop_all()
        print("Tablas eliminadas.")


@cli.command("create_admin")
@click.option("--email", required=True, help="Email del admin")
@click.option("--password", required=True, help="Contraseña del admin")
def create_admin(email, password):
    """
    Crea un usuario administrador en la BD
    Uso: python manage.py create_admin --email admin@example.com --password secret
    """
    with app.app_context():
        # Verificar si ya existe un admin con ese email
        if User.query.filter_by(email=email).first():
            print("El admin ya existe.")
            return
        
        # Crear nuevo usuario admin con password hasheada
        u = User(
            email=email,
            password_hash=generate_password_hash(password),
            name="Admin",
            role="admin"
        )
        db.session.add(u)
        db.session.commit()
        print(f"Admin creado: {u.id}")


if __name__ == "__main__":
    cli()
