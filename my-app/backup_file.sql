PGDMP      "                |           mydb    16.3 (Postgres.app)    16.4 (Homebrew) �    !           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            "           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            #           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            $           1262    20679    mydb    DATABASE     p   CREATE DATABASE mydb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE mydb;
                quentin    false                        2615    32743    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                quentin    false            %           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   quentin    false    5            &           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   quentin    false    5            r           1247    32756    AccountType    TYPE     Y   CREATE TYPE public."AccountType" AS ENUM (
    'USER',
    'ADMIN',
    'SUPER_ADMIN'
);
     DROP TYPE public."AccountType";
       public          quentin    false    5            �           1247    34513    GameType    TYPE     b   CREATE TYPE public."GameType" AS ENUM (
    'VIDEO_GAME',
    'BOARD_GAME',
    'TABLETOP_RPG'
);
    DROP TYPE public."GameType";
       public          quentin    false    5            �            1259    32772    API_Key    TABLE       CREATE TABLE public."API_Key" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    key text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."API_Key";
       public         heap    quentin    false    5            �            1259    32771    API_Key_id_seq    SEQUENCE     �   CREATE SEQUENCE public."API_Key_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."API_Key_id_seq";
       public          quentin    false    5    217            '           0    0    API_Key_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."API_Key_id_seq" OWNED BY public."API_Key".id;
          public          quentin    false    216            �            1259    32911    Badge    TABLE       CREATE TABLE public."Badge" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Badge";
       public         heap    quentin    false    5            �            1259    32910    Badge_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Badge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Badge_id_seq";
       public          quentin    false    5    245            (           0    0    Badge_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Badge_id_seq" OWNED BY public."Badge".id;
          public          quentin    false    244            �            1259    32813    Category    TABLE     y   CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    type public."GameType" NOT NULL
);
    DROP TABLE public."Category";
       public         heap    quentin    false    945    5            �            1259    32812    Category_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Category_id_seq";
       public          quentin    false    225    5            )           0    0    Category_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;
          public          quentin    false    224            �            1259    32842 	   Character    TABLE     q  CREATE TABLE public."Character" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "sessionId" integer NOT NULL,
    name text NOT NULL,
    class text NOT NULL,
    level integer NOT NULL,
    stats jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Character";
       public         heap    quentin    false    5            �            1259    32841    Character_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Character_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Character_id_seq";
       public          quentin    false    231    5            *           0    0    Character_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Character_id_seq" OWNED BY public."Character".id;
          public          quentin    false    230            �            1259    32852    Comment    TABLE     #  CREATE TABLE public."Comment" (
    id integer NOT NULL,
    "sessionId" integer NOT NULL,
    "userId" integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Comment";
       public         heap    quentin    false    5            �            1259    32851    Comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Comment_id_seq";
       public          quentin    false    233    5            +           0    0    Comment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;
          public          quentin    false    232            �            1259    32803    Game    TABLE     B  CREATE TABLE public."Game" (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    "coverImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    player_max integer
);
    DROP TABLE public."Game";
       public         heap    quentin    false    5            �            1259    32802    Game_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Game_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Game_id_seq";
       public          quentin    false    5    223            ,           0    0    Game_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."Game_id_seq" OWNED BY public."Game".id;
          public          quentin    false    222            �            1259    32793    Group    TABLE     �   CREATE TABLE public."Group" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Group";
       public         heap    quentin    false    5            �            1259    32792    Group_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Group_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Group_id_seq";
       public          quentin    false    221    5            -           0    0    Group_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Group_id_seq" OWNED BY public."Group".id;
          public          quentin    false    220            �            1259    32892 
   Invitation    TABLE     d  CREATE TABLE public."Invitation" (
    id integer NOT NULL,
    "sessionId" integer NOT NULL,
    "inviterId" integer NOT NULL,
    "inviteeId" integer NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
     DROP TABLE public."Invitation";
       public         heap    quentin    false    5            �            1259    32891    Invitation_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Invitation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Invitation_id_seq";
       public          quentin    false    241    5            .           0    0    Invitation_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Invitation_id_seq" OWNED BY public."Invitation".id;
          public          quentin    false    240            �            1259    32938    Message    TABLE       CREATE TABLE public."Message" (
    id integer NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);
    DROP TABLE public."Message";
       public         heap    quentin    false    5            �            1259    32937    Message_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Message_id_seq";
       public          quentin    false    251    5            /           0    0    Message_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;
          public          quentin    false    250            �            1259    32832    Participation    TABLE     (  CREATE TABLE public."Participation" (
    id integer NOT NULL,
    "sessionId" integer NOT NULL,
    "userId" integer NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 #   DROP TABLE public."Participation";
       public         heap    quentin    false    5            �            1259    32831    Participation_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Participation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."Participation_id_seq";
       public          quentin    false    5    229            0           0    0    Participation_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."Participation_id_seq" OWNED BY public."Participation".id;
          public          quentin    false    228            �            1259    32862    Rating    TABLE     D  CREATE TABLE public."Rating" (
    id integer NOT NULL,
    "gameId" integer NOT NULL,
    "userId" integer NOT NULL,
    rating double precision NOT NULL,
    review text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Rating";
       public         heap    quentin    false    5            �            1259    32861    Rating_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Rating_id_seq";
       public          quentin    false    235    5            1           0    0    Rating_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Rating_id_seq" OWNED BY public."Rating".id;
          public          quentin    false    234            �            1259    32872    Reward    TABLE     !  CREATE TABLE public."Reward" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    points integer NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Reward";
       public         heap    quentin    false    5            �            1259    32871    Reward_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Reward_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Reward_id_seq";
       public          quentin    false    5    237            2           0    0    Reward_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Reward_id_seq" OWNED BY public."Reward".id;
          public          quentin    false    236            �            1259    32822    Session    TABLE     �  CREATE TABLE public."Session" (
    id integer NOT NULL,
    "gameId" integer NOT NULL,
    "hostId" integer NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Session";
       public         heap    quentin    false    5            �            1259    32821    Session_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Session_id_seq";
       public          quentin    false    227    5            3           0    0    Session_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Session_id_seq" OWNED BY public."Session".id;
          public          quentin    false    226            �            1259    32928    SpecialEvent    TABLE     s  CREATE TABLE public."SpecialEvent" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 "   DROP TABLE public."SpecialEvent";
       public         heap    quentin    false    5            �            1259    32927    SpecialEvent_id_seq    SEQUENCE     �   CREATE SEQUENCE public."SpecialEvent_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."SpecialEvent_id_seq";
       public          quentin    false    249    5            4           0    0    SpecialEvent_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."SpecialEvent_id_seq" OWNED BY public."SpecialEvent".id;
          public          quentin    false    248            �            1259    32882 	   Statistic    TABLE     #  CREATE TABLE public."Statistic" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "sessionId" integer NOT NULL,
    data jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Statistic";
       public         heap    quentin    false    5            �            1259    32881    Statistic_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Statistic_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Statistic_id_seq";
       public          quentin    false    239    5            5           0    0    Statistic_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Statistic_id_seq" OWNED BY public."Statistic".id;
          public          quentin    false    238            �            1259    32782    User    TABLE     �  CREATE TABLE public."User" (
    id integer NOT NULL,
    username text NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    password text NOT NULL,
    "profilePicture" text,
    bio text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "accountType" public."AccountType" DEFAULT 'USER'::public."AccountType" NOT NULL,
    firebase_id text
);
    DROP TABLE public."User";
       public         heap    quentin    false    882    5    882            �            1259    32921 	   UserBadge    TABLE     �   CREATE TABLE public."UserBadge" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "badgeId" integer NOT NULL,
    "achievedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."UserBadge";
       public         heap    quentin    false    5            �            1259    32920    UserBadge_id_seq    SEQUENCE     �   CREATE SEQUENCE public."UserBadge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."UserBadge_id_seq";
       public          quentin    false    247    5            6           0    0    UserBadge_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."UserBadge_id_seq" OWNED BY public."UserBadge".id;
          public          quentin    false    246            �            1259    32781    User_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."User_id_seq";
       public          quentin    false    5    219            7           0    0    User_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;
          public          quentin    false    218            �            1259    32903    Wishlist    TABLE       CREATE TABLE public."Wishlist" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "gameId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Wishlist";
       public         heap    quentin    false    5            �            1259    32902    Wishlist_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Wishlist_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Wishlist_id_seq";
       public          quentin    false    5    243            8           0    0    Wishlist_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Wishlist_id_seq" OWNED BY public."Wishlist".id;
          public          quentin    false    242            �            1259    32947    _GroupToUser    TABLE     [   CREATE TABLE public."_GroupToUser" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 "   DROP TABLE public."_GroupToUser";
       public         heap    quentin    false    5            �            1259    32950    _SessionToSpecialEvent    TABLE     e   CREATE TABLE public."_SessionToSpecialEvent" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 ,   DROP TABLE public."_SessionToSpecialEvent";
       public         heap    quentin    false    5            �            1259    34526    _categories    TABLE     X   CREATE TABLE public._categories (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
    DROP TABLE public._categories;
       public         heap    quentin    false    5            �            1259    32744    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    quentin    false    5            �           2604    33103 
   API_Key id    DEFAULT     l   ALTER TABLE ONLY public."API_Key" ALTER COLUMN id SET DEFAULT nextval('public."API_Key_id_seq"'::regclass);
 ;   ALTER TABLE public."API_Key" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    216    217    217                       2604    33104    Badge id    DEFAULT     h   ALTER TABLE ONLY public."Badge" ALTER COLUMN id SET DEFAULT nextval('public."Badge_id_seq"'::regclass);
 9   ALTER TABLE public."Badge" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    245    244    245            �           2604    33105    Category id    DEFAULT     n   ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);
 <   ALTER TABLE public."Category" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    225    224    225                       2604    33106    Character id    DEFAULT     p   ALTER TABLE ONLY public."Character" ALTER COLUMN id SET DEFAULT nextval('public."Character_id_seq"'::regclass);
 =   ALTER TABLE public."Character" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    230    231    231                       2604    33107 
   Comment id    DEFAULT     l   ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);
 ;   ALTER TABLE public."Comment" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    232    233    233            �           2604    33108    Game id    DEFAULT     f   ALTER TABLE ONLY public."Game" ALTER COLUMN id SET DEFAULT nextval('public."Game_id_seq"'::regclass);
 8   ALTER TABLE public."Game" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    222    223    223            �           2604    33109    Group id    DEFAULT     h   ALTER TABLE ONLY public."Group" ALTER COLUMN id SET DEFAULT nextval('public."Group_id_seq"'::regclass);
 9   ALTER TABLE public."Group" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    220    221    221                       2604    33110    Invitation id    DEFAULT     r   ALTER TABLE ONLY public."Invitation" ALTER COLUMN id SET DEFAULT nextval('public."Invitation_id_seq"'::regclass);
 >   ALTER TABLE public."Invitation" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    240    241    241                       2604    33111 
   Message id    DEFAULT     l   ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);
 ;   ALTER TABLE public."Message" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    250    251    251                       2604    33112    Participation id    DEFAULT     x   ALTER TABLE ONLY public."Participation" ALTER COLUMN id SET DEFAULT nextval('public."Participation_id_seq"'::regclass);
 A   ALTER TABLE public."Participation" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    229    228    229                       2604    33113 	   Rating id    DEFAULT     j   ALTER TABLE ONLY public."Rating" ALTER COLUMN id SET DEFAULT nextval('public."Rating_id_seq"'::regclass);
 :   ALTER TABLE public."Rating" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    235    234    235            
           2604    33114 	   Reward id    DEFAULT     j   ALTER TABLE ONLY public."Reward" ALTER COLUMN id SET DEFAULT nextval('public."Reward_id_seq"'::regclass);
 :   ALTER TABLE public."Reward" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    236    237    237                        2604    33115 
   Session id    DEFAULT     l   ALTER TABLE ONLY public."Session" ALTER COLUMN id SET DEFAULT nextval('public."Session_id_seq"'::regclass);
 ;   ALTER TABLE public."Session" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    226    227    227                       2604    33116    SpecialEvent id    DEFAULT     v   ALTER TABLE ONLY public."SpecialEvent" ALTER COLUMN id SET DEFAULT nextval('public."SpecialEvent_id_seq"'::regclass);
 @   ALTER TABLE public."SpecialEvent" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    248    249    249                       2604    33117    Statistic id    DEFAULT     p   ALTER TABLE ONLY public."Statistic" ALTER COLUMN id SET DEFAULT nextval('public."Statistic_id_seq"'::regclass);
 =   ALTER TABLE public."Statistic" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    238    239    239            �           2604    33118    User id    DEFAULT     f   ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
 8   ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    218    219    219                       2604    33119    UserBadge id    DEFAULT     p   ALTER TABLE ONLY public."UserBadge" ALTER COLUMN id SET DEFAULT nextval('public."UserBadge_id_seq"'::regclass);
 =   ALTER TABLE public."UserBadge" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    247    246    247                       2604    33120    Wishlist id    DEFAULT     n   ALTER TABLE ONLY public."Wishlist" ALTER COLUMN id SET DEFAULT nextval('public."Wishlist_id_seq"'::regclass);
 <   ALTER TABLE public."Wishlist" ALTER COLUMN id DROP DEFAULT;
       public          quentin    false    243    242    243            �          0    32772    API_Key 
   TABLE DATA           S   COPY public."API_Key" (id, user_id, name, key, created_at, updated_at) FROM stdin;
    public          quentin    false    217   �                 0    32911    Badge 
   TABLE DATA           X   COPY public."Badge" (id, name, description, icon, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    245   )�                 0    32813    Category 
   TABLE DATA           4   COPY public."Category" (id, name, type) FROM stdin;
    public          quentin    false    225   F�                 0    32842 	   Character 
   TABLE DATA           u   COPY public."Character" (id, "userId", "sessionId", name, class, level, stats, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    231   ��       	          0    32852    Comment 
   TABLE DATA           a   COPY public."Comment" (id, "sessionId", "userId", content, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    233   ��       �          0    32803    Game 
   TABLE DATA           q   COPY public."Game" (id, name, type, description, "coverImage", "createdAt", "updatedAt", player_max) FROM stdin;
    public          quentin    false    223   ��       �          0    32793    Group 
   TABLE DATA           R   COPY public."Group" (id, name, description, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    221   ��                 0    32892 
   Invitation 
   TABLE DATA           s   COPY public."Invitation" (id, "sessionId", "inviterId", "inviteeId", status, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    241   �                 0    32938    Message 
   TABLE DATA           a   COPY public."Message" (id, "senderId", "receiverId", content, "createdAt", "readAt") FROM stdin;
    public          quentin    false    251   %�                 0    32832    Participation 
   TABLE DATA           f   COPY public."Participation" (id, "sessionId", "userId", status, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    229   B�                 0    32862    Rating 
   TABLE DATA           d   COPY public."Rating" (id, "gameId", "userId", rating, review, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    235   _�                 0    32872    Reward 
   TABLE DATA           _   COPY public."Reward" (id, "userId", points, description, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    237   |�                 0    32822    Session 
   TABLE DATA           �   COPY public."Session" (id, "gameId", "hostId", "startTime", "endTime", location, description, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    227   ��                 0    32928    SpecialEvent 
   TABLE DATA           q   COPY public."SpecialEvent" (id, name, description, "startDate", "endDate", "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    249   ��                 0    32882 	   Statistic 
   TABLE DATA           `   COPY public."Statistic" (id, "userId", "sessionId", data, "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    239   ��       �          0    32782    User 
   TABLE DATA           �   COPY public."User" (id, username, first_name, last_name, email, password, "profilePicture", bio, "createdAt", "updatedAt", "accountType", firebase_id) FROM stdin;
    public          quentin    false    219   ��                 0    32921 	   UserBadge 
   TABLE DATA           L   COPY public."UserBadge" (id, "userId", "badgeId", "achievedAt") FROM stdin;
    public          quentin    false    247   ��                 0    32903    Wishlist 
   TABLE DATA           V   COPY public."Wishlist" (id, "userId", "gameId", "createdAt", "updatedAt") FROM stdin;
    public          quentin    false    243   ��                 0    32947    _GroupToUser 
   TABLE DATA           2   COPY public."_GroupToUser" ("A", "B") FROM stdin;
    public          quentin    false    252   ��                 0    32950    _SessionToSpecialEvent 
   TABLE DATA           <   COPY public."_SessionToSpecialEvent" ("A", "B") FROM stdin;
    public          quentin    false    253   
                 0    34526    _categories 
   TABLE DATA           /   COPY public._categories ("A", "B") FROM stdin;
    public          quentin    false    254   '       �          0    32744    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          quentin    false    215   �       9           0    0    API_Key_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."API_Key_id_seq"', 1, false);
          public          quentin    false    216            :           0    0    Badge_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Badge_id_seq"', 1, false);
          public          quentin    false    244            ;           0    0    Category_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Category_id_seq"', 82, true);
          public          quentin    false    224            <           0    0    Character_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Character_id_seq"', 1, false);
          public          quentin    false    230            =           0    0    Comment_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Comment_id_seq"', 1, false);
          public          quentin    false    232            >           0    0    Game_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Game_id_seq"', 71, true);
          public          quentin    false    222            ?           0    0    Group_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Group_id_seq"', 1, false);
          public          quentin    false    220            @           0    0    Invitation_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Invitation_id_seq"', 1, false);
          public          quentin    false    240            A           0    0    Message_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Message_id_seq"', 1, false);
          public          quentin    false    250            B           0    0    Participation_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Participation_id_seq"', 1, false);
          public          quentin    false    228            C           0    0    Rating_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Rating_id_seq"', 1, false);
          public          quentin    false    234            D           0    0    Reward_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Reward_id_seq"', 1, false);
          public          quentin    false    236            E           0    0    Session_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Session_id_seq"', 1, false);
          public          quentin    false    226            F           0    0    SpecialEvent_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."SpecialEvent_id_seq"', 1, false);
          public          quentin    false    248            G           0    0    Statistic_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Statistic_id_seq"', 1, false);
          public          quentin    false    238            H           0    0    UserBadge_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."UserBadge_id_seq"', 1, false);
          public          quentin    false    246            I           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 1, true);
          public          quentin    false    218            J           0    0    Wishlist_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Wishlist_id_seq"', 1, false);
          public          quentin    false    242                       2606    32780    API_Key API_Key_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."API_Key"
    ADD CONSTRAINT "API_Key_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."API_Key" DROP CONSTRAINT "API_Key_pkey";
       public            quentin    false    217            >           2606    32919    Badge Badge_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Badge" DROP CONSTRAINT "Badge_pkey";
       public            quentin    false    245            *           2606    32820    Category Category_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_pkey";
       public            quentin    false    225            0           2606    32850    Character Character_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Character"
    ADD CONSTRAINT "Character_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Character" DROP CONSTRAINT "Character_pkey";
       public            quentin    false    231            2           2606    32860    Comment Comment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_pkey";
       public            quentin    false    233            '           2606    32811    Game Game_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."Game" DROP CONSTRAINT "Game_pkey";
       public            quentin    false    223            %           2606    32801    Group Group_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Group" DROP CONSTRAINT "Group_pkey";
       public            quentin    false    221            :           2606    32901    Invitation Invitation_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."Invitation" DROP CONSTRAINT "Invitation_pkey";
       public            quentin    false    241            D           2606    32946    Message Message_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Message" DROP CONSTRAINT "Message_pkey";
       public            quentin    false    251            .           2606    32840     Participation Participation_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."Participation"
    ADD CONSTRAINT "Participation_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY public."Participation" DROP CONSTRAINT "Participation_pkey";
       public            quentin    false    229            4           2606    32870    Rating Rating_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Rating" DROP CONSTRAINT "Rating_pkey";
       public            quentin    false    235            6           2606    32880    Reward Reward_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Reward"
    ADD CONSTRAINT "Reward_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Reward" DROP CONSTRAINT "Reward_pkey";
       public            quentin    false    237            ,           2606    32830    Session Session_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Session" DROP CONSTRAINT "Session_pkey";
       public            quentin    false    227            B           2606    32936    SpecialEvent SpecialEvent_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."SpecialEvent"
    ADD CONSTRAINT "SpecialEvent_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."SpecialEvent" DROP CONSTRAINT "SpecialEvent_pkey";
       public            quentin    false    249            8           2606    32890    Statistic Statistic_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Statistic"
    ADD CONSTRAINT "Statistic_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Statistic" DROP CONSTRAINT "Statistic_pkey";
       public            quentin    false    239            @           2606    32926    UserBadge UserBadge_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."UserBadge" DROP CONSTRAINT "UserBadge_pkey";
       public            quentin    false    247            "           2606    32791    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            quentin    false    219            <           2606    32909    Wishlist Wishlist_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Wishlist" DROP CONSTRAINT "Wishlist_pkey";
       public            quentin    false    243                       2606    32752 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            quentin    false    215                       1259    32953    API_Key_key_key    INDEX     M   CREATE UNIQUE INDEX "API_Key_key_key" ON public."API_Key" USING btree (key);
 %   DROP INDEX public."API_Key_key_key";
       public            quentin    false    217            (           1259    32957    Category_name_key    INDEX     Q   CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);
 '   DROP INDEX public."Category_name_key";
       public            quentin    false    225                       1259    32955    User_email_key    INDEX     K   CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
 $   DROP INDEX public."User_email_key";
       public            quentin    false    219                        1259    32956    User_firebase_id_key    INDEX     W   CREATE UNIQUE INDEX "User_firebase_id_key" ON public."User" USING btree (firebase_id);
 *   DROP INDEX public."User_firebase_id_key";
       public            quentin    false    219            #           1259    32954    User_username_key    INDEX     Q   CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);
 '   DROP INDEX public."User_username_key";
       public            quentin    false    219            E           1259    32958    _GroupToUser_AB_unique    INDEX     ^   CREATE UNIQUE INDEX "_GroupToUser_AB_unique" ON public."_GroupToUser" USING btree ("A", "B");
 ,   DROP INDEX public."_GroupToUser_AB_unique";
       public            quentin    false    252    252            F           1259    32959    _GroupToUser_B_index    INDEX     P   CREATE INDEX "_GroupToUser_B_index" ON public."_GroupToUser" USING btree ("B");
 *   DROP INDEX public."_GroupToUser_B_index";
       public            quentin    false    252            G           1259    32960     _SessionToSpecialEvent_AB_unique    INDEX     r   CREATE UNIQUE INDEX "_SessionToSpecialEvent_AB_unique" ON public."_SessionToSpecialEvent" USING btree ("A", "B");
 6   DROP INDEX public."_SessionToSpecialEvent_AB_unique";
       public            quentin    false    253    253            H           1259    32961    _SessionToSpecialEvent_B_index    INDEX     d   CREATE INDEX "_SessionToSpecialEvent_B_index" ON public."_SessionToSpecialEvent" USING btree ("B");
 4   DROP INDEX public."_SessionToSpecialEvent_B_index";
       public            quentin    false    253            I           1259    34529    _categories_AB_unique    INDEX     Z   CREATE UNIQUE INDEX "_categories_AB_unique" ON public._categories USING btree ("A", "B");
 +   DROP INDEX public."_categories_AB_unique";
       public            quentin    false    254    254            J           1259    34530    _categories_B_index    INDEX     L   CREATE INDEX "_categories_B_index" ON public._categories USING btree ("B");
 )   DROP INDEX public."_categories_B_index";
       public            quentin    false    254            K           2606    32962    API_Key API_Key_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."API_Key"
    ADD CONSTRAINT "API_Key_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 J   ALTER TABLE ONLY public."API_Key" DROP CONSTRAINT "API_Key_user_id_fkey";
       public          quentin    false    3618    217    219            P           2606    32997 "   Character Character_sessionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Character"
    ADD CONSTRAINT "Character_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 P   ALTER TABLE ONLY public."Character" DROP CONSTRAINT "Character_sessionId_fkey";
       public          quentin    false    3628    231    227            Q           2606    32992    Character Character_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Character"
    ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public."Character" DROP CONSTRAINT "Character_userId_fkey";
       public          quentin    false    3618    231    219            R           2606    33007    Comment Comment_sessionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 L   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_sessionId_fkey";
       public          quentin    false    3628    233    227            S           2606    33002    Comment Comment_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_userId_fkey";
       public          quentin    false    3618    233    219            Y           2606    33042 $   Invitation Invitation_inviteeId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 R   ALTER TABLE ONLY public."Invitation" DROP CONSTRAINT "Invitation_inviteeId_fkey";
       public          quentin    false    3618    241    219            Z           2606    33037 $   Invitation Invitation_inviterId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 R   ALTER TABLE ONLY public."Invitation" DROP CONSTRAINT "Invitation_inviterId_fkey";
       public          quentin    false    3618    241    219            [           2606    33047 $   Invitation Invitation_sessionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 R   ALTER TABLE ONLY public."Invitation" DROP CONSTRAINT "Invitation_sessionId_fkey";
       public          quentin    false    3628    241    227            `           2606    33077    Message Message_receiverId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public."Message" DROP CONSTRAINT "Message_receiverId_fkey";
       public          quentin    false    251    219    3618            a           2606    33072    Message Message_senderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public."Message" DROP CONSTRAINT "Message_senderId_fkey";
       public          quentin    false    219    251    3618            N           2606    32987 *   Participation Participation_sessionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Participation"
    ADD CONSTRAINT "Participation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 X   ALTER TABLE ONLY public."Participation" DROP CONSTRAINT "Participation_sessionId_fkey";
       public          quentin    false    229    3628    227            O           2606    32982 '   Participation Participation_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Participation"
    ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 U   ALTER TABLE ONLY public."Participation" DROP CONSTRAINT "Participation_userId_fkey";
       public          quentin    false    229    3618    219            T           2606    33017    Rating Rating_gameId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Rating" DROP CONSTRAINT "Rating_gameId_fkey";
       public          quentin    false    3623    235    223            U           2606    33012    Rating Rating_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Rating" DROP CONSTRAINT "Rating_userId_fkey";
       public          quentin    false    3618    235    219            V           2606    33022    Reward Reward_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reward"
    ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Reward" DROP CONSTRAINT "Reward_userId_fkey";
       public          quentin    false    237    3618    219            L           2606    32972    Session Session_gameId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Session" DROP CONSTRAINT "Session_gameId_fkey";
       public          quentin    false    227    3623    223            M           2606    32977    Session Session_hostId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Session" DROP CONSTRAINT "Session_hostId_fkey";
       public          quentin    false    227    3618    219            W           2606    33032 "   Statistic Statistic_sessionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Statistic"
    ADD CONSTRAINT "Statistic_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 P   ALTER TABLE ONLY public."Statistic" DROP CONSTRAINT "Statistic_sessionId_fkey";
       public          quentin    false    3628    239    227            X           2606    33027    Statistic Statistic_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Statistic"
    ADD CONSTRAINT "Statistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public."Statistic" DROP CONSTRAINT "Statistic_userId_fkey";
       public          quentin    false    219    239    3618            ^           2606    33067     UserBadge UserBadge_badgeId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES public."Badge"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public."UserBadge" DROP CONSTRAINT "UserBadge_badgeId_fkey";
       public          quentin    false    3646    247    245            _           2606    33062    UserBadge UserBadge_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public."UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";
       public          quentin    false    3618    247    219            \           2606    33057    Wishlist Wishlist_gameId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public."Wishlist" DROP CONSTRAINT "Wishlist_gameId_fkey";
       public          quentin    false    3623    243    223            ]           2606    33052    Wishlist Wishlist_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public."Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";
       public          quentin    false    3618    243    219            b           2606    33082     _GroupToUser _GroupToUser_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_GroupToUser"
    ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";
       public          quentin    false    252    3621    221            c           2606    33087     _GroupToUser _GroupToUser_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_GroupToUser"
    ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";
       public          quentin    false    219    252    3618            d           2606    33092 4   _SessionToSpecialEvent _SessionToSpecialEvent_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_SessionToSpecialEvent"
    ADD CONSTRAINT "_SessionToSpecialEvent_A_fkey" FOREIGN KEY ("A") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."_SessionToSpecialEvent" DROP CONSTRAINT "_SessionToSpecialEvent_A_fkey";
       public          quentin    false    3628    253    227            e           2606    33097 4   _SessionToSpecialEvent _SessionToSpecialEvent_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_SessionToSpecialEvent"
    ADD CONSTRAINT "_SessionToSpecialEvent_B_fkey" FOREIGN KEY ("B") REFERENCES public."SpecialEvent"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."_SessionToSpecialEvent" DROP CONSTRAINT "_SessionToSpecialEvent_B_fkey";
       public          quentin    false    3650    253    249            f           2606    34531    _categories _categories_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public._categories
    ADD CONSTRAINT "_categories_A_fkey" FOREIGN KEY ("A") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 J   ALTER TABLE ONLY public._categories DROP CONSTRAINT "_categories_A_fkey";
       public          quentin    false    225    254    3626            g           2606    34536    _categories _categories_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public._categories
    ADD CONSTRAINT "_categories_B_fkey" FOREIGN KEY ("B") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 J   ALTER TABLE ONLY public._categories DROP CONSTRAINT "_categories_B_fkey";
       public          quentin    false    223    254    3623            �      x������ � �            x������ � �         h  x�m��r�0���)|�)-`c���o���ɩ3a6A�l9�Ą<M��羁_�"��5�`��շ�p;d����x�|��I��(��D�U<����� WZ· UL��p�T)N$��B|�Lsz��|dX�_Z�D^*��|ي*��_��I^�<�\H	Z"���R��u�b9P�%�~��<2��֡�ډ9-7H��b�p�3Vh�c;�Q�:�0�T�N�PBƪ?�d)�= �9v%�P��$Ը�R��!�;�ڗc���d�a�C"񢁳-�w��JRU^��� �u����g$��3����68!�)d&aH���s��������!�"Қ9�`����|`J0�g��W��9vu�F+���hC��"e���P�|�����"(K���5|k�:dB��6O���M_u�W��}�v�2ݘ ���f�3���M�h�EkڃY����X�7xYh��v��JM���%��EZ�<ޗJ�UI���I���;j�����\Q��5�b�� u&/1��B�
.���t��W�2�S�����c~!� ���FS�w���BQ�����[&4�;گ@:�bl��X��f7�Ǝ���HO-`cIT��>�~}m�Z��.t            x������ � �      	      x������ � �      �      x��\M��Hr=�|��EũOT#6I#�w�ِ43_
U6$� `��'_�|s�4�aO{����3 �� {4^3���ww�J�z/3��-�F�5e�7�[�c�g�W��s�����ý���ĺ߷1��7}����}�5���mb�w����kkxa��]պ~��{�qY�ul�?x.����]���}�m�n�7�헋��u���*�6��]ߴn��Yo��U��7ۯn�W�Wk�����)�en�v�n����W�����1��Ӧ���\���߻M��m��m�|���a�gLJ��H�<��P"���2/K���KB-a"�fE�J�%c����Ji|�S��W�.���Q~��?��\�禎sXǬp}��Y�|r�QF<= �n�K�wO\Y�M�'�4c���Z�ck��7u�;xYЇ�﫦���i����1�Y�M(bȍ �'2g�Xa=��q�(���3�����Szi�]0E�]<o�rK��m�!��W��p��۲�uWݜ���Z�k����W}U�����~�q_�b�4e=|p۴U�9�� \�<�tfyp%�U�����=��e��^�� p��욈��,y �	A��8Mb�\�ȸ,�|M8]r)�^q���m ��?�L���5 ��=���@ ��q�b�#�~��A��,z���1�	�$�sK� �b!��ޟ�9EO�%�*��/�4�����K{²i��(�'�n�
��mv�Mw�o�6=Y�����,�����Z xxc��/��C���C����8�ȅ��TDRe��Jg4�i^������)�R.s�/�W�w/e|���]��iv	i����_7���gp����o��*ȠNH3kh~lk��w�h�.�s���|:l��O]�3.X��m ���D{h�l�u5PN���ݰ�p@N�/�&	XD~ 6�D�NѴa�S,v�ErF�F|�Gd	"CA�����>��Hz%�J�%5f�HJ-mnꊋŋ=���M�	�/B캁R����Y���v-�a ���Aiy�O���\��]p�#��c�e�.�`��$��]Ӕ��e�8������+j�V.�+.o{זh��R�WH�d���D�%2ʐ�۸��7b��.���}�� ����H��c���K׷�����ԍ�V�H�%E���(45\����]Q����5_�F)$
Z��?<�C�C��U8�l��.=�ݑ�6�фl�Al�3�ۻ�b���A�]�1΃���\�pE��L������6��b����<���6
��.^D�:��Wٳ�u
9{�Vۘ}ݸ6d� ��
�m|<z��d�Q1S4 7�(�ɲ@&�: �@(���Ob����?��|�A���#��c��Umb�j�>-Ѹ(]�6���RW���������	T����O�(�\��E�YI�ю����xI�Y35]3n��qX3fA�4�
i̾�k�'������/���jE䍘�N�|���������h/����i��~�nԍnX��8�rP���NӓdI�P��1��˅y�+8&�K�"���D���
wJp}z9�^إ��Ӌ�`� ��%�� �lBڹq �v���a��oM�P��=\�ES�����K�2��`#5�{�xT%8Rk�"f�E��R�AULQU|)�����9�����4Y�v$���?LH�{R�}ۄ}՝8~0D�{xW���f3J�c��×������>��X	 �:���`��ģ#�1bP=ӅT��E�����(��0�x�E�sONP>�����������T�;2�f��9!Џ��dxk��`��JօJXۡ�2��yW�i(���bi��P�G��s�Xa�.�K!������P��1�g�����C�p}b�7պ��C2,����v�]�zj;:�= ��#���͓Cq�����>D~1c��,�K�%Th煍�X0����ȅ��|{=ad����P��_-����ǀX1,(�d�����*�KH��we�<��5�y��8���휯�KK��KI�Pe�(�P�Pm"�p	�s�[pM���Jq�ǅN���[ �'����Ӥ}P�:�����_�,B�\瓈�>n������yh�����9lm�Zb�-��%uVR��s�ɧ@J�dJ-��o�������ٌһ�����^� ��Rǫ��+خ���T7�Rż��?�.7�G��<��p+��P�3wb��e��Pz��A��֕�*��v����I���{,Qt �4C��f5�!�Ҟ��0�Յ���춯���ǂD�ؗ8l��R
�)e)�3�Jه0�Km%V����ξ���W����m�����%���G*���#�C@̺O������S���͓j�k�˩�&Z�3{O��ZFIP/nϰ�,H,�3��̊s��,�̊q0ϸ�@��V�����z�x�"<�n�7ʹF�����2�]�"	�ӖI����n�%����\�arһ�M�;���!���H�KR�v~o�34W�N��+E��>�X��+ɗ*�ޜ/�^������ǁ�������h�]n��� ��G�E�x�r��
 ��w���C � �B�%(R"@�Vf �d���Y�$5ʝ�MT��A ����3%�_崜������޵��j8�.0�����_/T�ÙOC��[C�u[���RJ½�Vh��0AQ��ZZ1)���K	����z�4!{�c8�ˉ;,��~Ƥ{|.�o0o�U��2PTg��4(�n��GԮm>\�(\�����$9HO4O��L#�'8པ���Ɠ�;��|�)�%�fM�(��E�I5m�����¥_�"ء��%t w�60ㅶ�Ӽ55:�����.�D*Z�#�QYxO�	����d��.���b�拷;Pޡi�v,�'�ֵ�^����Ó���W7�=�>�R��C���+� !hI�hЁ ��#��J�:*��']{��!�3DXB���u���U�}����Z�;]����ukAgxvW��`wMU_��|�,�R`4'`����<�������6�3�N��|%�2g@,�U���7ٛ*<��#�:�*���� ���X����k���|w1#0��y;3bRR��W`Ё
$��Dy_���?hܡ:�P|��`9�J��6M���u�yR���Xڮ�P��!sՓc׳:J�%'��C���g:n?�.8݃ |�t^!XVpa��Z�B0�r �౰ʁ�
���+��-�	l���V���E�b����:�]m�v�Mj��lۡ����d�U�*k�n6ysUh�DA
�=��s�{p��i@��a�f)@x�+i���a������M���a>�SUd�;�T�,���#}��n:��b?�S�xt���Z�����L��9�7���!F�tQ�"�8�+/ -�
"K��"�G��!�~in"-��B�+�o�ݙ���c����`��NY<=�ʌ���B�Dj^~��kn�&V3N��!y�.O5�c�v,?��+ȕ�K�y�dI�x���ow�ς�d�fo��
�(�㾏̐���n\�����/}{�ǁ>���-����m���ب�rm
p6Qyᵓ����h��i d��iQ>��߉�U+F�V����&������_\��]�-���S˰��5�m>������!��ga,�W>��U�Co�P��u<�xEϸ>[
++���������� U?d���y�	8���P
���k��Wɉ����� >��8\�6ե6��!�2���p��&�罄)Y!���"D2� %�
�8>#�؄w��K�s��J��mB�!�nk��Y�^�nn"n�/���o\�m���y2���͙�M���qbs�.�o�����O%iib??�a����T�9'")��$�QZm�����'�8_	>��+��~���c[��_�߶���rv�G���=�Ş�`��T�q�t����1��� �+P�2��rB�g�DT���W
��<��s	�OW@)� �  �|�_��������/�,���	ꊼǌ�4��Im��6Z����������G��&$��h��BJG������z"������r��|�l�V ��&�^>��5����'E���Xe��`����Y�ө�u[��)�1�y�m�J0x��X�X��kj��h���RY,�m�hz7/<�&>��=r�`:�3���b��ޝU!<0c=��Sm�u�`���F�-ӥt�D̍����ژ�B�|%��O�}�
�Gj���F�p�c�7^���w?��GN�MV�"g�����~s�:��D�i`����eT*�� #B`k�".��1�5������Fő�ɇ �r`+��?K���N���Pϻlac
XV�bp��������m�+/U_?DxF���D�4CA=�����΂�`��s��Ɏ%V�-���EiӨ`�!�s��A��i��9�޺�6�sz��<�*�6���6�{��.+A�]nvf�0��,ê��P%��1<Ǒ�B+[2%E���`�w�)� ��b�f�*������}w��m�)�F_�YXg̖'�&�-&Qjŋ�U'1��/�MUNk`ڼ���[MPZF�f2�JS�ϔ���
$�$�\,r�T.Ҍ$�=08sS6�_�������<�sl��:�&��!ݱ1�5��X@���z�\�/��x2x�����D �ud�[0�	gJĂ���D�O�Bj���`�S]I�xb�с8?s{_|=����o�)��S��3V�o�����HBahvE�K��0J�)�3�֊��Y��� ��UjJXcLYD7���kR��W�,<.�r��O#����C%���8�O,��)��EC�Fw�������s�lQ���;�mxx�s�KF ���a�0//K^(K��K�9�X	�F�
�\��@�ÿd�s�[ *���>�ޝ�J�6�A=�3���
K9�O����$��f8��� �s�Cu�A��2KQ��<ш��s⊀�Y �h0!�J�b!������������B��q������(�q�i��J�S5�����iwM{2��*U'N��U�ab�����.)~D� @�y��䄇�]�����;&����p�E�����Yv��eX���ė�b�0���P'����#�85��͎ ��#s�V��ϼ���;j��!��/x�7�'��Q��s{ ��B�<�E�hsS���a ��'��+xv ����MU�_�]xo���| ~��n�^����.{��$���jS��%�]��gε�NpK��D*����Q]r)�����V�K�N��<c�%'�n��%��8��Z�ۃg�����a�T�ɸ�AU^v��.���V�<��9쥬?iu��X�V��'��bK+WAW��]�����]�&ۅ��fn�\m����Bx�ur�c~w��*��~�����v��>�~w��.��sHEjC��x��X)u���`��&r~8_J-����;��ًt���t����a�kd�*N������ ��M �n4��_����7<�>�>�R���t_H�]$�.�FQ�B��Za��^���_:3j�*$ 5����U��L��!�b�/���PG�n��+�ƃ��
���
����������w�_𥰸Wڂ�<hk)p�QTQ)U��iffC�Y�"�_ �_�/!x���ВB��U�1����n��4=����ZUH<9����!�y���R����4өPA��G���1y	�� �(b4�`��\�v�_�+ao��b2��?5}���{��8��pu��n��٢`Bv�ݡD<�^�A�*���'�W!M���F�U>�!���žj� ��8���Ҹt�U
�܀Z4XB�9
|bK���	fںR.�A2������<����lWm�f��u�D�]s�=�3���{��Ig�n�Ʌ��Vf��5A�vGP�"���X�
�S���s�u�R�jpK�ꟗWWW�P��      �      x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �      �   �   x�]�1�0 @ѹ�����I,ƨ(�H0��T
JQ��qq0����B�ͳ����謁/���c&o��๾�#=�X�}P���S�2^�%��F�l`�UN]�޶Vd�rz-�c��D��lOFh�`�PR���t��b����H�k�Ű��������O��b�%PӴx�9�            x������ � �            x������ � �            x������ � �            x������ � �         �   x�%��0�0L�`�.����c!�-m������{[��*/Z�hz�G131�v>]�6^g۹�g���Hgs8a|g_��y����<��n��MGZb���\R]�UZ��o���u1~(ҫ,i�D�=(���cx#�ݾ��-�}ƁvK���T�U�����|B4E      �   �   x�m�=jAF��S��HI3�C�3?Rp�q��g��!��ދlւ$e��X�Sא5��j�kG�^#JunZ0F�y�錬�\ԃ2�d�sr�~qKH'��qϲ��Y}���!Aa�r��^o���q�r�\���F�^�4��Yj�8FR%��3���'`,qx�������r(��{�2ȧ�hb����"���Rv�-�)��*�����/o�����(_�m]���]�     