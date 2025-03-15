import { Form, Input, InputNumber, Button, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ProductEdit() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm(); // Khởi tạo form

  // Fetch sản phẩm theo ID
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/products/${id}`);
      return data;
    },
    enabled: !!id, // Chỉ fetch khi có ID
  });

  // Mutation cập nhật sản phẩm
  const updateProduct = useMutation({
    mutationFn: async (updatedProduct: any) => {
      await axios.put(`http://localhost:3000/products/${id}`, updatedProduct);
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/product/list");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
    },
  });

  // Khi có dữ liệu, set vào form
  if (product && !isLoading) {
    form.setFieldsValue({
      ...product,
      size: product.size?.join(", "),
      color: product.color?.join(", "),
    });
  }

  // Xử lý submit form
  const onFinish = (values: any) => {
    const formattedProduct = {
      ...values,
      price: parseFloat(values.price),
      stock_quantity: parseInt(values.stock_quantity),
      size: values.size.split(",").map((s: string) => s.trim()),
      color: values.color.split(",").map((c: string) => c.trim()),
    };
    updateProduct.mutate(formattedProduct);
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Chỉnh Sửa Sản Phẩm</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Nhập tên sản phẩm" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="desc" rules={[{ required: true, message: "Nhập mô tả" }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Giá (VND)" name="price" rules={[{ required: true, message: "Nhập giá sản phẩm" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Số lượng tồn kho" name="stock_quantity" rules={[{ required: true, message: "Nhập số lượng tồn kho" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: "Nhập danh mục sản phẩm" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Kích cỡ (cách nhau bằng dấu phẩy)" name="size" rules={[{ required: true, message: "Nhập kích cỡ" }]}>
          <Input placeholder="Ví dụ: S, M, L, XL" />
        </Form.Item>

        <Form.Item label="Màu sắc (cách nhau bằng dấu phẩy)" name="color" rules={[{ required: true, message: "Nhập màu sắc" }]}>
          <Input placeholder="Ví dụ: Đỏ, Xanh, Đen" />
        </Form.Item>

        <Form.Item label="URL hình ảnh" name="image" rules={[{ required: true, message: "Nhập URL hình ảnh" }]}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateProduct.isPending}>
            Cập Nhật Sản Phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ProductEdit;
