import { Table, Image, Button, Popconfirm, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // API lấy danh sách sản phẩm
  const getAllProduct = async () => {
    const { data } = await axios.get("http://localhost:3000/products");
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });

  // Mutation xóa sản phẩm
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa sản phẩm.");
    },
  });

  // Cấu hình cột bảng
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng tồn kho",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Image src={image} width={100} />,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/product/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => deleteProduct.mutate(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        onClick={() => navigate("/product/add")}
        style={{ marginBottom: 16 }}
      >
        Thêm Sản Phẩm
      </Button>
      <Table dataSource={data} columns={columns} loading={isLoading} />
    </div>
  );
}

export default ProductList;
