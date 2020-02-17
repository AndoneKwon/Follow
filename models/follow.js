module.exports = (sequelize, DataTypes)=>(
    sequelize.define('follow',{
        follower :{
            type : DataTypes.INTEGER,
            allowNull : false,
        },//follow를 하는사람(게시물 요청자)

        following :{
            type : DataTypes.INTEGER,
            allowNull : false,
        },//follow를 당하는사람(게시물 제공자)

        like_num : {
            type : DataTypes.INTEGER,
            allowNull : false,
            defaultValue : 0,
        },

        comment_num : {
            type : DataTypes.INTEGER,
            allowNull : false,
            defaultValue : 0,
        },

        status : {
            type : DataTypes.TINYINT(1),
            allowNull : false,
            defaultValue : 1,
        },
    
    },
    
        {
            paranoid : true,
        }

    
    )

);