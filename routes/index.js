let express = require('express');
var knex = require('../config/knex');
let router = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require('bcrypt');
const saltRounds = 10;

var cron = require('node-cron');
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // อนุญาตให้มีการเรียกใช้งาน API จากทุกๆ Origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // กำหนดว่าเมธอดใด ๆ ที่ยอมรับให้มีการเรียกใช้งาน API
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // อนุญาตให้มีการส่งค่า Authorization Bearer
    next();
});
/* GET home page. */

router.get('/', function (req, res, next) {

    res.render('index', { title: 'Express' });

});
outer.get('/Checkdata', async function (req, res, next) {
    try {
        res.json("data");
    } catch (error) {
        res.json(error);
    }
});
router.post('/loginCheck', async function (req, res, next) {
    try {
        let Result = await checkPassword({ password: req.body.password, })
        let data = await knex.knex('user').where({ user_name: req.body.user_name }).select();
        if (data.length != 0 && Result == true) {
            const access_token = jwtGenerate(data)
            const refresh_token = jwtRefreshTokenGenerate(data)
            res.json({ access_token: access_token, refresh_token: refresh_token, username: data[0].username, user_type: data[0].user_type, id: data[0].id, name: data[0].user_firstname });
        } else {
            res.json({});
        }
        // res.json(data);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
});
//เพิ่มมาใหม่
router.get('/get_course', async function (req, res, next) {
    try {
        let data = await knex.knex('course').select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.get('/get_userall', async function (req, res, next) {
    try {
        let data = await knex.knex('user').select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/get_userid', async function (req, res, next) {
    try {
        let data = await knex.knex('user').where({ id: req.body.id }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/add_user', async function (req, res, next) {
    try {
        let password = await hashPassword(req.body.password)
        let data = await knex.knex('user').insert({
            user_name: req.body.user_name,
            password: password,
            user_type: req.body.user_type,
            user_firstname: req.body.user_firstname,
            user_lastname: req.body.user_lastname,
            user_year: parseInt(req.body.user_year || 0),
            user_unit: parseInt(req.body.user_unit || 0),
            id_card: req.body.id_card,
            tel: req.body.tel,
            student_id: req.body.student_id,
            user_firstname_th: req.body.user_firstname_th,
            user_lastname_th: req.body.user_lastname_th
            
        });
        console.log(data)
        let Result = await checkPassword({ password: password, })
        if (Result === true) {
            res.status(200).send({ message: true });
        } else {
            res.status(404).send({ message: false });
        }

        // res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/update_user', async function (req, res, next) {
    try {
        console.log(req.body.teacher_id)
        let data = await knex.knex('user').where({ id: req.body.id }).update({
            user_type: req.body.user_type,
            user_firstname: req.body.user_firstname,
            user_lastname: req.body.user_lastname,
            user_year: parseInt(req.body.user_year),
            user_unit: parseInt(req.body.user_unit),
            id_card: req.body.id_card,
            tel: req.body.tel,
            student_id: req.body.student_id,
            university: req.body.university,
            group: req.body.group,
            branch: req.body.branch,
            university_old: req.body.university_old,
            teacher_id: req.body.teacher_id,
            teacher: req.body.teacher_name,
            user_firstname_th: req.body.user_firstname_th,
            user_lastname_th: req.body.user_lastname_th
        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/update_user_flag', async function (req, res, next) {
    try {
        let data = await knex.knex('user').where({ id: req.body.id }).update({
            user_flag: req.body.user_flag,
        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/update_user_approve', async function (req, res, next) {
    try {
        let data = await knex.knex('user').where({ id: req.body.id }).update({
            user_flag_ther: req.body.user_flag_ther,
        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/get_user_flag', async function (req, res, next) {
    try {
        let data = await knex.knex('user').where({ user_flag: 1, user_year: req.body.user_year }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/dalete_user', async function (req, res, next) {
    try {
        let data = await knex.knex('user').where({ id: req.body.id }).del();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.get('/get_universityAll', async function (req, res, next) {
    try {
        let data = await knex.knex('university').select();
        data.forEach(i => {
            i.value = i.id_subject
            i.label = i.id_subject
        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/search_university', async function (req, res, next) {
    try {
        const searchTerm = req.body.searchTerm;
        let data = await knex.knex('university').select('*')
            .where('sub_name', 'like', `%${searchTerm}%`);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/search_university_year', async function (req, res, next) {
    try {
        const searchTerm = req.body.searchTerm;
        let data = await knex.knex('university').select('*')
            .where('university_year', 'like', `%${searchTerm}%`);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/add_university', async function (req, res, next) {
    try {
        console.log('checkdata')
        let data = await knex.knex('university').insert({
            id_subject: req.body.id_subject,
            sub_name: req.body.sub_name,
            explanation: req.body.explanation,
            group: req.body.group,
            unit: parseInt(req.body.unit),
            university_year:req.body.university_year,

        });

        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/update_university', async function (req, res, next) {
    try {
        let data = await knex.knex('university').where({ id_subject: req.body.id_subject }).update({
            sub_name: req.body.sub_name,
            explanation: req.body.explanation,
            university_year: req.body.university_year,

        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/dalete_university', async function (req, res, next) {
    try {
        let data = await knex.knex('university').where({ id_subject: req.body.id_subject }).del();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.get('/get_schoolAll', async function (req, res, next) {
    try {
        let data = await knex.knex('school').select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/add_school', async function (req, res, next) {
    try {
        let data = await knex.knex('school').insert({
            names: req.body.names,
            year_school: req.body.year_school,
        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/update_school', async function (req, res, next) {
    try {
        let data = await knex.knex('school').where({ id_school: req.body.id_school }).update({
            names: req.body.names,
            year_school: req.body.year_school,
        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/delete_school', async function (req, res, next) {
    try {
        let data = await knex.knex('school').where({ id_school: req.body.id_school }).del();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/search_school', async function (req, res, next) {
    try {
        const searchTerm = req.body.searchTerm;
        let data = await knex.knex('school').select('*')
            .where('names', 'like', `%${searchTerm}%`);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/search_date', async function (req, res, next) {
    try {
        const selectedYear = req.body.selectedYear;
        let data = await knex.knex('school').select('*')
            .where('year_school', 'like', `%${selectedYear}%`);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/get_subjectbuid', async function (req, res, next) {
    try {
        let data = await knex.knex('subject').where({ id_school: req.body.id_school }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/add_course', async function (req, res, next) {
    try {
        for (let i = 0; i < req.body.length; i++) {
            for (let j = 0; j < req.body[i].groupuniversity.length; j++) {
                if (req.body[i].groupuniversity[j].id_course === null) {
                    let data = await knex.knex('course').insert({
                        id_school: req.body[i].id_school,
                        name_subject: req.body[i].groupuniversity[j].sub_name,
                        id_subject: req.body[i].groupuniversity[j].id_subject,
                        id_university: req.body[i].id_university,
                        name_university: req.body[i].name_university,
                        unit_subject: req.body[i].unit_university,
                        group: req.body[i].group,
                        unit_university: req.body[i].unit_university
                    });
                }
            }
        }
        res.json("data seve ok");
    } catch (error) {
        res.json(error);
    }
});
router.post('/delete_course', async function (req, res, next) {
    try {
        let data = await knex.knex('course').where({ id_university: req.body.id_university, id_school: req.body.id_school }).del();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/get_coursebyid', async function (req, res, next) {
    try {
        let data = await knex.knex('course').where({ id_school: req.body.id_school }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/add_subject', async function (req, res, next) {
    try {
        let data = await knex.knex('subject').insert({
            id_subject: req.body.id_subject,
            id_school: req.body.id_school,
            sub_name: req.body.sub_name,
            explanation: req.body.explanation,
        });
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/get_course_gradebyid', async function (req, res, next) {
    try {
        let data = await knex.knex('course_grade').where({ id_school: req.body.id_school, id_user: req.body.id_user }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/get_course_grade', async function (req, res, next) {
    try {
        let data = await knex.knex('course_grade').where({ id_user: req.body.id_user, }).whereNotNull('grade').select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/add_course_grade', async function (req, res, next) {
    try {
        for (let i = 0; i < req.body.length; i++) {
            for (let j = 0; j < req.body[i].groupuniversity.length; j++) {
                if (req.body[i].groupuniversity[j].id_course === null) {
                    let data = await knex.knex('course_grade').insert({
                        id_school: req.body[i].id_school,
                        name_subject: req.body[i].groupuniversity[j].sub_name,
                        id_subject: req.body[i].groupuniversity[j].id_subject,
                        id_university: req.body[i].id_university,
                        name_university: req.body[i].name_university,
                        unit_subject: req.body[i].unit_university,
                        group: req.body[i].group,
                        unit_university: req.body[i].unit_university,
                        grade: req.body[i].groupuniversity[j].id_course,
                        id_user: req.body[i].id_user
                    });
                } else {
                    // console.log(id_course: req.body[i].groupuniversity[j].id_course)
                    let data = await knex.knex('course_grade').where({ id_course: req.body[i].groupuniversity[j].id_course }).update({
                        grade: req.body[i].groupuniversity[j].grade,

                    });
                }
            }
        }
        res.json("data seve ok");
    } catch (error) {
        res.json(error);
    }
});
router.post('/update_course_grade', async function (req, res, next) {
    try {
        for (let i = 0; i < req.body.length; i++) {
            for (let j = 0; j < req.body[i].groupuniversity.length; j++) {
                if (req.body[i].result_tc != null) {
                    let data = await knex.knex('course_grade').where({ id_course: req.body[i].groupuniversity[j].id_course }).update({
                        result_tc: req.body[i].result_tc,
                    });
                }

            }
        }
        res.json("data seve ok");
    } catch (error) {
        res.json(error);
    }
});
router.post('/registerUser', async function (req, res, next) {
    try {
        let password = await hashPassword(req.body.password)
        let data = await knex.knex('user_register').insert({
            username: req.body.username,
            password: password,
            userType: req.body.userType,
            firstName: req.body.firstName,
            surName: req.body.surName,
            birthdate: req.body.birthdate,
            telephoneNumber: req.body.telephoneNumber,
        });
        let Result = await checkPassword({ password: password, })
        if (Result === true) {
            res.status(200).send({ message: true });
        } else {
            res.status(404).send({ message: false });
        }

    } catch (error) {
        res.json(error);
    }
});
router.post('/get_line', async function (req, res, next) {
    try {
        await line.notify(req.body.message, process.env.TOKEN)
        return res.status(200).send({ message: "Notify Successfully." });
    } catch (error) {
        return res.json({ error: error.response.data.message });
    }
});
router.get('/getWashingMachine', async function (req, res, next) {
    try {
        // let check = await jwtValidate(req)

        let data = await knex.knex('washing_machine').select();
        let check = await jwtValidate(req)
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/getWashingMachineByid', async function (req, res, next) {
    try {
        let data = await knex.knex('washing_machine').where({ id: req.body.id }).select();
        let check = await jwtValidate(req)
        // console.log(data)
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.get('/getTransactionMachine', async function (req, res, next) {
    try {
        let check = await jwtValidate(req)
        let data = await knex.knex('public.transaction_machine')
            .select('washing_machine_id', 'status')
            .max({ latest_value: 'date' })
            .max({ latest_time: 'time' })
            .groupBy('washing_machine_id', 'status')


        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/getTransactionMachineByid', async function (req, res, next) {
    try {
        let check = await jwtValidate(req)
        let data = await knex.knex('public.transaction_machine')
            .select('washing_machine_id', 'status')
            .max({ latest_value: 'date' })
            .max({ latest_time: 'time' })
            .where({ 'washing_machine_id': req.body.id })
            .groupBy('washing_machine_id', 'status')
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post('/addTransactionMachine', async function (req, res, next) {
    try {
        let check = await jwtValidate(req)
        let data = await knex.knex('transaction_machine').insert({
            user_register_id: req.body.user_register_id,
            washing_machine_id: req.body.washing_machine_id,
            status: req.body.status,
            date: req.body.date,
            time: req.body.time,
            paytype: req.body.paytype,
            createAt: new Date(),
            createBy: req.body.createBy,
            modifyAt: new Date(),
            modifyBy: req.body.modifyBy,
        });

        if (data != null) {
            res.status(200).send({ message: true });
        } else {
            res.status(404).send({ message: false });
        }

    } catch (error) {
        res.json(error);
    }
});
router.get('/get_userall_user', async function (req, res, next) {
    try {
        let data = await knex.knex('user').where({ user_type: 'user' }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.get('/get_userall_teacher', async function (req, res, next) {
    try {
        let data = await knex.knex('user').where({ user_type: 'teacher' }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
//---- 
router.post('/add_teacher', async function (req, res, next) {
    try {
        for (let i = 0; i < req.body.length; i++) {
            const { teacher1, teacher2, teacher3 } = req.body[i];
            console.log(req.body[i].teacher1)
            for (let j = 0; j < req.body[i].groupuniversity.length; j++) {
                {
                    let data = await knex.knex('course_grade').where({ id_course: req.body[i].groupuniversity[j].id_course }).update({
                        teacher1:req.body[i].teacher1,teacher2: req.body[i].teacher2,teacher3: req.body[i].teacher3
                    });
                }

            }
        }
        res.json("Data saved successfully");
    } catch (error) {
        res.json(error);
    }
});
//---
router.post('/get_userall_teacher_user_year', async function (req, res, next) {
    try {
        console.log(req.body)
        let data = await knex.knex('user').where({ user_type: 'user', user_year: req.body.user_year }).select();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

const findLatestValuesById = (arr) => {
    const latestValuesById = {};

    arr.forEach((item) => {
        console.log(item)
        item.latest_value = new Date(item.latest_value).toISOString().slice(0, 10);
        const currentDateTime = new Date(`${item.latest_value}T${item.latest_time}`).getTime();
        const latestItem = latestValuesById[item.washing_machine_id];

        if (!latestItem || currentDateTime > new Date(`${latestItem.latest_value}T${latestItem.latest_time}`).getTime()) {
            latestValuesById[item.washing_machine_id] = { ...item };
        }
    });

    return Object.values(latestValuesById);
};
const compareTimes = (datas) => {
    if (datas != null) {
        const time1Parts = datas.split(':');
        const time2all = new Date()
        const hours1 = parseInt(time1Parts[0], 10);
        const minutes1 = parseInt(time1Parts[1], 10);
        const seconds1 = parseInt(time1Parts[2], 10);

        const hours2 = parseInt(time2all.getHours());
        const minutes2 = parseInt(time2all.getMinutes());
        const seconds2 = parseInt(time2all.getSeconds());

        const totalMinutes1 = hours1 * 60 + minutes1;
        const totalMinutes2 = hours2 * 60 + minutes2;
        // console.log(totalMinutes1, totalMinutes2)
        let difference = 0;
        if (totalMinutes1 > totalMinutes2) {
            difference = Math.abs(totalMinutes1 - totalMinutes2);
        } else {
            difference = 0;
        }

        return difference
    } else {
        return 0
    }


};
async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}
async function comparePassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
}
const jwtGenerate = (user) => {
    const accessToken = jwt.sign(
        { username: user.username, id: user.id, password: user.password, user_type: user.user_type },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1H", algorithm: "HS256" }
    )

    return accessToken
}
const jwtRefreshTokenGenerate = (user) => {
    const refreshToken = jwt.sign(
        { username: user.username, id: user.id, password: user.password, user_type: user.user_type },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d", algorithm: "HS256" }
    )

    return refreshToken
}
const jwtValidate = (req, res, next) => {
    try {
        if (!req.headers["authorization"]) return res.sendStatus(401)

        const token = req.headers["authorization"].replace("Bearer ", "")

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) throw new Error(error)
        })

    } catch (error) {
        return res.sendStatus(403)
    }
}
async function checkPassword(data) {
    try {
        let password = await hashPassword(data.password)
        const isPasswordMatch = await comparePassword(data.password, password);
        let passcheck = false
        if (isPasswordMatch) {
            // console.log('Password is correct!');
            passcheck = true
        } else {
            passcheck = false
            // console.log('Password is incorrect!');
        }
        return passcheck
    } catch (error) {
        return res.sendStatus(403)
    }
}

module.exports = router;