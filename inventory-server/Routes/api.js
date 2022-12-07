const router = require("express").Router();
const authorisation = require("../Middleware/authorisation");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DEFAULT_IMAGE="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
router.get("/", authorisation, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.post("/v1/products", authorisation, async (req, res) => {
  try {
    const { title, image, price, stock, description } = req.body;
    const updateUser = await prisma.users.update({
      where: {
        userphone: req.user,
      },
      data: {
        userproducts: {
          create: {
            title: title,
            image: image.length===0? DEFAULT_IMAGE: image,
            description: description,
            price: parseInt(price),
            stock: parseInt(stock),
          },
        },
      },
    });

    const users = await prisma.users.findMany();
    console.log(users);

    const usersWithPosts = await prisma.users.findUnique({
      include: {
        userproducts: true,
      },
      where: {
        userphone: req.user,
      },
    });
    data = usersWithPosts.userproducts[usersWithPosts.userproducts.length - 1];
    res.json({ msg: "successful fetch", data: data });
  } catch (error) {
    res.json({ msg: "failed fetch" });
  }
});

router.get("/v1/products", async (req, res) => {
  try {
    const usersWithPosts = await prisma.users.findMany({
      include: {
        userproducts: true,
      },
    });

    let data = [];
    usersWithPosts.forEach((e) => {
      e.userproducts.forEach((e) => {
        data.push(e);
      });
    });
    console.log("data",data);
    res.json({ msg: "successful fetch", data: data });
  } catch (error) {
    res.json({ msg: "failed fetch" });
  }
});

router.delete("/v1/products/:id", authorisation, async (req, res) => {
  try {
    const usersWithPosts = await prisma.products.findMany();

    const deletePosts = await prisma.products.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.json({ msg: "successful delete" });
  } catch (error) {
    res.json({ msg: "delete failed" });
  }
});
router.put("/v1/products/:id", authorisation, async (req, res) => {
  try {
    const { title, image, price, stock, description } = req.body;
    const updateProduct = await prisma.products.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        title: title,
        image: image.length===0? DEFAULT_IMAGE: image,

        description: description,
        price: parseInt(price),
        stock: parseInt(stock),
      },
    });
    res.json({ msg: "update successful" });
  } catch (error) {
    res.json({ msg: "update failed" });
  }
});

module.exports = router;
