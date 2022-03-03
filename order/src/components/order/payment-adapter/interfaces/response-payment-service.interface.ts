export interface IResponsePaymentService {
  data: {
    order_id: number;
    success: boolean;
    message?: string;
  };
}
