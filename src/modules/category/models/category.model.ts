export const CategoryTableModel = `
    CREATE TABLE IF NOT EXISTS categories (
        id serial primary key,
        name varchar(255) not null,
        category_id int references categories(id)
        on delete cascade 
        on update no action,
        image varchar(255),
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp
    );
`