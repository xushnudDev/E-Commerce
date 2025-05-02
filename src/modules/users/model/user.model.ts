export const UserTableModel = `
    create table if not exists users(
        id serial primary key,
        fullname text not null,
        username text not null,
        email text not null,
        password text not null,
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp
    );`