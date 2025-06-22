// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// @desc Get  bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public
export const getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "display bootcamp" });
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Update bootcamp" });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "delete bootcamp" });
};
