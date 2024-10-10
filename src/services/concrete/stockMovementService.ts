
import prisma from "../../config/prisma";
import { StockMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class StockMovementService {
    private stockMovementRepository: BaseRepository<StockMovement>;

    constructor() {
        this.stockMovementRepository = new BaseRepository<StockMovement>(prisma.stockMovement);
    }

    async createStockMovement(stockMovementData: any): Promise<StockMovement> {
        try {
            const stockMovement = await prisma.stockMovement.create({
                data: {
                    productCode: stockMovementData.productCode,
                    warehouseCode: stockMovementData.warehouseCode,
                    branchCode: stockMovementData.branchCode,
                    currentCode: stockMovementData.currentCode,
                    movementType: stockMovementData.movementType,
                    invoiceNo: stockMovementData.invoiceNo,
                    gcCode: stockMovementData.gcCode,
                    type: stockMovementData.type,
                    description: stockMovementData.description,
                    quantity: stockMovementData.quantity,
                    unitPrice: stockMovementData.unitPrice,
                    totalPrice: stockMovementData.totalPrice,
                    invoiceDate: stockMovementData.invoiceDate,
                    warehouse: stockMovementData.warehouseCode ? {
                        connect: {
                            warehouseCode: stockMovementData.warehouseCode
                        }
                    } : {},
                    outWarehouse: stockMovementData.outWarehouseCode ? {
                        connect: {
                            warehouseCode: stockMovementData.outWarehouseCode
                        }
                    } : undefined,
                    branch: stockMovementData.branchCode ? {
                        connect: {
                            branchCode: stockMovementData.branchCode
                        }
                    } : {},
                    stockCard: {
                        connect: {
                            productCode: stockMovementData.productCode
                        }
                    },
                    priceList: stockMovementData.priceListId ? {
                        connect: {
                            id: stockMovementData.priceListId
                        }
                    } : undefined,
                }
            });
            return stockMovement;
        } catch (error) {
            logger.error("Error creating stock movement", error);
            throw error;
        }
    }


    async updateStockMovement(id: string, stockMovement: Partial<StockMovement>): Promise<StockMovement> {
        try {
            return await this.stockMovementRepository.update(id, stockMovement);
        } catch (error) {
            logger.error(`Error updating stock movement with id ${id}`, error);
            throw error;
        }
    }

    async deleteStockMovement(id: string): Promise<boolean> {
        try {
            return await this.stockMovementRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting stock movement with id ${id}`, error);
            throw error;
        }
    }

    async getStockMovementById(id: string): Promise<StockMovement | null> {
        try {
            return await this.stockMovementRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching stock movement with id ${id}`, error);
            throw error;
        }
    }

    async getAllStockMovements(): Promise<StockMovement[]> {
        try {
            return await this.stockMovementRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all stock movements", error);
            throw error;
        }
    }

    async getStockMovementsWithFilters(filter: any): Promise<StockMovement[] | null> {
        try {
            return await this.stockMovementRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching stock movements with filters", error);
            throw error;
        }
    }
}

export default StockMovementService;