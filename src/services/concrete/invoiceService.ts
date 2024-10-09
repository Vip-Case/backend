
import { Invoice, InvoiceDetail } from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";

export const InvoiceRelations = {
    InvoiceDetail: true
};

export class InvoiceService {
    private invoiceRepository = new BaseRepository<Invoice> (prisma.invoice);
    private invoiceDetailRepository = new BaseRepository<InvoiceDetail> (prisma.invoiceDetail);

    async getAllInvoices(): Promise<Invoice[]> {
        return this.invoiceRepository.findAll();
    }

    async getInvoiceById(id: string): Promise<Invoice | null> {
        return this.invoiceRepository.findById(id);
    }

    async createInvoice(invoice: Invoice): Promise<Invoice> {
        return this.invoiceRepository.create(invoice);
    }

    async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
        return this.invoiceRepository.update(id, invoice);
    }

    async deleteInvoice(id: string): Promise<boolean> {
        return this.invoiceRepository.delete(id);
    }

    async createInvoiceWithRelations(invoice: Invoice, invoiceDetails: InvoiceDetail[]): Promise<Invoice> {
        try {
            const newInvoice = await this.invoiceRepository.create(invoice);
            for (const invoiceDetail of invoiceDetails) {
                invoiceDetail.invoiceId = newInvoice.id;
                await this.invoiceDetailRepository.create(invoiceDetail);
            }
            return newInvoice;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async updateInvoiceWithRelations(id: string, invoice: Partial<Invoice>, invoiceDetails: InvoiceDetail[]): Promise<Invoice> {
        try {
            await this.invoiceDetailRepository.deleteWithFilters({ invoiceId: id });
            for (const invoiceDetail of invoiceDetails) {
                invoiceDetail.invoiceId = id;
                await this.invoiceDetailRepository.create(invoiceDetail);
            }
            return this.invoiceRepository.update(id, invoice);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async deleteInvoiceWithRelations(id: string): Promise<boolean> {
        try {
            await this.invoiceDetailRepository.deleteWithFilters({ invoiceId: id });
            return this.invoiceRepository.delete(id);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getAllInvoicesWithRelations(): Promise<Invoice[]> {
        return this.invoiceRepository.findAll(
            {
                include: {
                    InvoiceDetail: true
                }
            }
        );
    }

    async getInvoiceWithRelationsById(id: string): Promise<Invoice | null> {
        return this.invoiceRepository.findByIdWithOptions(id, {
            include: {
                InvoiceDetail: true
            }
        });
    }

}

export default InvoiceService;