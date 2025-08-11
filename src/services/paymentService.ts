import { supabase } from '../lib/supabase';
import type { Payment } from '../lib/supabase';

export interface CreatePaymentData {
  studentId: string;
  amount: number;
  paymentMethod: 'Espèces' | 'Mobile Money' | 'Virement Bancaire';
  paymentType: 'Inscription' | 'Scolarité' | 'Cantine' | 'Transport' | 'Fournitures' | 'Autre';
  paymentDate: string;
  periodDescription?: string;
  referenceNumber?: string;
  mobileNumber?: string;
  bankDetails?: string;
  notes?: string;
}

export const paymentService = {
  // Récupérer tous les paiements avec informations élève
  async getPayments(limit?: number) {
    let query = supabase
      .from('payments')
      .select(`
        *,
        students (
          id,
          first_name,
          last_name,
          classes (name, levels (name))
        )
      `)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Récupérer les paiements d'un élève
  async getStudentPayments(studentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Créer un nouveau paiement
  async createPayment(paymentData: CreatePaymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        student_id: paymentData.studentId,
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod,
        payment_type: paymentData.paymentType,
        payment_date: paymentData.paymentDate,
        period_description: paymentData.periodDescription,
        reference_number: paymentData.referenceNumber,
        mobile_number: paymentData.mobileNumber,
        bank_details: paymentData.bankDetails,
        notes: paymentData.notes,
        status: 'Confirmé',
        processed_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select(`
        *,
        students (first_name, last_name, classes (name))
      `)
      .single();

    if (error) throw error;

    // Mettre à jour le montant payé de l'élève
    await supabase.rpc('update_student_payment', {
      student_id: paymentData.studentId,
      payment_amount: paymentData.amount
    });

    return data;
  },

  // Mettre à jour un paiement
  async updatePayment(id: string, updates: Partial<Payment>) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un paiement
  async deletePayment(id: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Statistiques financières
  async getFinancialStats(period?: 'month' | 'trimester' | 'year') {
    let dateFilter = '';
    const now = new Date();
    
    switch (period) {
      case 'month':
        dateFilter = `payment_date >= '${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-01'`;
        break;
      case 'trimester':
        // Logique pour trimestre actuel
        dateFilter = `payment_date >= '2024-10-01'`;
        break;
      case 'year':
        dateFilter = `payment_date >= '2024-10-01'`;
        break;
      default:
        dateFilter = `payment_date >= '${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-01'`;
    }

    const { data: payments, error } = await supabase
      .from('payments')
      .select('amount, payment_method, payment_type, payment_date')
      .eq('status', 'Confirmé');

    if (error) throw error;

    const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    
    const paymentMethods = payments?.reduce((acc, p) => {
      acc[p.payment_method] = (acc[p.payment_method] || 0) + p.amount;
      return acc;
    }, {} as Record<string, number>) || {};

    const paymentTypes = payments?.reduce((acc, p) => {
      acc[p.payment_type] = (acc[p.payment_type] || 0) + p.amount;
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      totalRevenue,
      paymentMethods,
      paymentTypes,
      transactionCount: payments?.length || 0
    };
  },

  // Récupérer les élèves avec paiements en retard
  async getOutstandingPayments() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        id,
        first_name,
        last_name,
        outstanding_amount,
        total_fees,
        paid_amount,
        classes (name, levels (name))
      `)
      .gt('outstanding_amount', 0)
      .eq('status', 'Actif')
      .order('outstanding_amount', { ascending: false });

    if (error) throw error;
    return data;
  }
};