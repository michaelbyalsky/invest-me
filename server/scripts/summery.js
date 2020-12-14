import { Summary, userStock } from "../models";
import sequelize from "sequeliize";

const sumData = async () => {
  const usersData = await userStock.findAll({
    attributes: [
      "userId",
      [
        sequelize.fn(
          "SUM",
          sequelize.where(sequelize.col("price"), "*", sequelize.col("amount"))
        ),
        "total",
      ],
    ],
    group: ["userId"],
    order: [
      [sequelize.fn("SUM", sequelize.col("totalCost")), "DESC"],
      // [sequelize.fn("AVG", sequelize.col("avgPrice")), "DESC"],
    ],
    raw: true,
  });
};
