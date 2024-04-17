const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil disimpan",
      error: false,
      data: {
        noteId: id,
      },
    });

    response.code(201);

    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = (request, h) => {
  return {
    status: "success",
    data: {
      notes,
    },
  };
};

const getSingleNoteHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((item) => item.id == id)[0];

  if (!note) {
    const response = h.response({
      status: "failed",
      message: "Catatan tidak ditemukan",
    });

    response.code(404);

    return response;
  }

  return {
    status: "success",
    data: {
      note,
    },
  };
};

const editNoteByIdHandler = (request, h) => {
  const { body, title, tags } = request.payload;
  const { id } = request.params;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((item) => item.id == id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      body,
      title,
      tags,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Catatan berhasil diperbaharui",
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbaharui catatan, Id tidak ditemukan.",
  });

  response.code(404);

  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id == id);

  if (index !== -1) {
    notes.splice(index, 1);

    const response = h.response({
      status: "success",
      message: "Catatan berhasil dihapus",
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal menghapus catatan, id tidak ditemukan",
  });

  response.code(404)

  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getSingleNoteHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
