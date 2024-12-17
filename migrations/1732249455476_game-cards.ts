import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  pgm.createTable("game_cards", {
    id: "id",
    game_id: {
      type: "integer",
      notNull: true,
    },
    card_id: {
      type: "integer",
      notNull: true,
    },
    // 0 if in main draw pile, -1 in play piles, user_id
    user_id: {
      type: "integer",
      notNull: true,
    },
    // position in user's hand
    position: {
      type: "uuid",
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("game_cards");
}
