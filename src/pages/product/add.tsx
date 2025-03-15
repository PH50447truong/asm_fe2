import { Form, Input, InputNumber, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // API thêm sản phẩm
  const addProduct = async (product: any) => {
    await axios.post("http://localhost:3000/products", product);
  };

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Cập nhật danh sách sản phẩm
      navigate("/product/list");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi thêm sản phẩm.");
    },
  });

  const onFinish = (values: any) => {
    const formattedProduct = {
      ...values,
      price: parseFloat(values.price),
      stock_quantity: parseInt(values.stock_quantity),
      size: values.size.split(",").map((s: string) => s.trim()),
      color: values.color.split(",").map((c: string) => c.trim()),
    };
    mutation.mutate(formattedProduct);
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Thêm Sản Phẩm</h2>
      <Form layout="vertical" onFinish={onFinish}>
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
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Thêm Sản Phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ProductAdd;
