"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Request.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "student",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Receipt, {
        foreignKey: "request_id",
        as: "receipts",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasOne(models.OR_Number, {
        foreignKey: "request_id",
        as: "or_number",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Requirement, {
        foreignKey: "request_id",
        as: "requirements",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Bill, {
        foreignKey: "request_id",
        as: "bills",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Requested_Document, {
        foreignKey: "request_id",
        as: "requested_documents",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Additional_Document, {
        foreignKey: "request_id",
        as: "additional_documents",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Request.hasMany(models.Log, {
        foreignKey: "request_id",
        as: "logs",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    static generateReference() {
      return `req-${nanoid(8).toLowerCase()}`;
    }

    isPending() {
      return this.status === "pending";
    }

    isBalanceDue() {
      return this.status === "balance_due";
    }

    isDeficient() {
      return this.status === "deficient";
    }

    isUnderReview() {
      return this.status === "under_review";
    }

    isInvoiced() {
      return this.status === "invoiced";
    }

    isPaid() {
      return this.status === "paid";
    }

    isReleased() {
      return this.status === "released";
    }

    isRejected() {
      return this.status === "rejected";
    }

    getTotalDocumentQuantity() {
      return (this.requested_documents || []).reduce((total, rd) => {
        return total + (rd.quantity || 0);
      }, 0);
    }

    getTotalAdditionalQuantity() {
      return (this.additional_documents || []).reduce((total, ad) => {
        return total + (ad.quantity || 0);
      }, 0);
    }

    getGrandTotal() {
      const requestedTotal = (this.requested_documents || []).reduce(
        (sum, rd) => sum + (rd.quantity || 0) * (rd.document?.price || 0),
        0,
      );

      const additionalTotal = (this.additional_documents || []).reduce(
        (sum, ad) => sum + (ad.quantity || 0) * (ad.unit_price || 0),
        0,
      );

      const billsTotal = (this.bills || []).reduce(
        (sum, bill) => sum + (bill.price || 0),
        0,
      );

      return requestedTotal + additionalTotal + billsTotal;
    }

    getDocumentSummary() {
      const requested = (this.requested_documents || []).map((rd) => ({
        category: "requested",
        type: rd.document?.type,
        quantity: rd.quantity || 0,
        unit_price: rd.document?.price || 0,
        total: (rd.quantity || 0) * (rd.document?.price || 0),
      }));

      const additional = (this.additional_documents || []).map((ad) => ({
        category: "additional",
        type: ad.type,
        quantity: ad.quantity || 0,
        unit_price: ad.unit_price || 0,
        total: (ad.quantity || 0) * (ad.unit_price || 0),
      }));

      const bills = (this.bills || []).map((bill) => ({
        category: "bill",
        type: bill.name,
        unit_price: bill.price || 0,
        total: bill.price || 0,
      }));

      return [...requested, ...additional, ...bills];
    }

    markPendingToBalanceDue() {
      if (!this.isPending())
        throw new Error("Only pending requests can become balance due");
      this.status = "balance_due";
    }

    markPendingToUnderReview() {
      if (!this.isPending())
        throw new Error("Only pending requests can be under review");
      this.status = "under_review";
    }

    markBalanceDueToUnderReview() {
      if (!this.isBalanceDue())
        throw new Error("Only balance due requests can be under review");
      this.status = "under_review";
    }

    markUnderReviewToDeficient() {
      if (!this.isUnderReview())
        throw new Error("Only under review requests can be marked deficient");
      this.status = "deficient";
    }

    markDeficientToInvoiced() {
      if (!this.isDeficient())
        throw new Error("Only deficient requests can be invoiced");
      this.status = "invoiced";
    }

    markUnderReviewToInvoiced() {
      if (!this.isUnderReview())
        throw new Error("Only under review requests can be invoiced");
      this.status = "invoiced";
    }

    markInvoicedToPaid() {
      if (!this.isInvoiced())
        throw new Error("Only invoiced requests can be paid");
      this.status = "paid";
    }

    markPaidToReleased() {
      if (!this.isPaid()) throw new Error("Only paid requests can be released");
      this.status = "released";
      this.request_completed = new Date();
    }

    markDeficientToRejected() {
      if (!this.isDeficient())
        throw new Error("Only deficient requests can be rejected");
      this.status = "rejected";
    }

    markBalanceDueToRejected() {
      if (!this.isBalanceDue())
        throw new Error("Only balance due requests can be rejected");
      this.status = "rejected";
    }
  }
  Request.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      reference_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      delivery_method: {
        type: DataTypes.ENUM("delivery", "pickup"),
        allowNull: false,
      },
      request_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM(
          "rejected",
          "deficient",
          "balance_due",
          "under_review",
          "released",
          "pending",
          "paid",
          "invoiced",
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      request_completed: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      expected_release_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Request",
      tableName: "requests",
      underscored: true,
      timestamps: true,
      hooks: {
        beforeValidate: async (request) => {
          if (request.reference_number) return;

          let ref;
          let exists;

          do {
            ref = Request.generateReference();
            exists = await Request.findOne({
              where: { reference_number: ref },
            });
          } while (exists);

          request.reference_number = ref;
        },
      },
    },
  );
  sequelizePaginate.paginate(Request);

  return Request;
};
